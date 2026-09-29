import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { FeatureCollection } from 'geojson';
import { ActiveLayers } from './LayerControl';
import { TimelineStep, HotspotZone, VerificationCandidate, NavigationId } from '../types';
import { DRIFT_TRAJECTORY_DATA, HOTSPOT_ZONES, VERIFICATION_CANDIDATES } from '../data/mockData';
import {
  getDebrisHeatmapGeoJSON,
  getFanBurstLinesGeoJSON,
  COASTAL_CITIES,
  REGIONAL_LABELS,
} from '../data/debrisHeatmapData';
import { Flame, Sliders, Sparkles, ChevronUp, ChevronDown, Info } from 'lucide-react';

interface MapViewProps {
  layers: ActiveLayers;
  currentStep: TimelineStep;
  onSelectHotspot?: (hotspot: HotspotZone) => void;
  onSelectVerification?: (cand: VerificationCandidate) => void;
  selectedHotspotId?: string;
  onNavigate?: (id: NavigationId) => void;
  className?: string;
  showIncidentOnly?: boolean;
  showSatelliteOverlay?: boolean;
}

type HeatmapMode = 'satellite-thermal' | 'pure-heatmap' | 'contour-zones';

export const MapView: React.FC<MapViewProps> = ({
  layers,
  currentStep,
  onSelectHotspot,
  onSelectVerification,
  selectedHotspotId,
  onNavigate,
  className = 'h-[550px]',
  showIncidentOnly = false,
  showSatelliteOverlay = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const isLoadedRef = useRef(false);

  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('satellite-thermal');
  const [heatIntensity, setHeatIntensity] = useState<number>(1.2);
  const [isPulsing, setIsPulsing] = useState<boolean>(true);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // High-resolution Esri World Imagery (Satellite)
    const satelliteStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution:
            '&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
        },
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: satelliteStyle,
      center: [77.1, 8.85], // Balanced center covering Kerala, Kanyakumari, and Dhanushkodi
      zoom: 7.0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    map.on('load', () => {
      isLoadedRef.current = true;
      initMapSourcesAndLayers();
      updateMapDisplay();
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  };

  const initMapSourcesAndLayers = () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    // 1. ADD SATELLITE DEBRIS HEATMAP SOURCE (High-density point cloud)
    const heatmapGeoJSON = getDebrisHeatmapGeoJSON();
    if (!map.getSource('debris-heatmap-src')) {
      map.addSource('debris-heatmap-src', {
        type: 'geojson',
        data: heatmapGeoJSON,
      });

      // --- NATIVE MAPLIBRE HEATMAP LAYER ---
      map.addLayer({
        id: 'debris-heatmap-layer',
        type: 'heatmap',
        source: 'debris-heatmap-src',
        maxzoom: 15,
        paint: {
          // Weight points by their calculated intensity
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, 0,
            0.3, 0.4,
            0.6, 0.75,
            0.9, 0.95,
            1, 1,
          ],
          // Increase intensity with zoom
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 1.2 * heatIntensity,
            7, 2.2 * heatIntensity,
            9, 3.4 * heatIntensity,
            12, 4.5 * heatIntensity,
          ],
          // Authentic thermal color gradient matching user reference image:
          // Translucent marine edge -> Yellow (Low) -> Orange (Moderate) -> Red (High) -> Deep Crimson core
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0.0, 'rgba(0, 0, 0, 0)',
            0.12, 'rgba(6, 182, 212, 0.25)',     // Subtle cyan water boundary
            0.26, 'rgba(34, 197, 94, 0.5)',      // Turquoise/green transition
            0.42, 'rgba(250, 204, 21, 0.88)',    // Bright Yellow (Low Concentration)
            0.66, 'rgba(249, 115, 22, 0.95)',    // Vibrant Orange (Moderate Concentration)
            0.85, 'rgba(239, 68, 68, 0.98)',     // Vivid Red (High Concentration)
            1.0, 'rgba(185, 28, 28, 1.0)',       // Deep Crimson core hotspot
          ],
          // Radius transition for continuous fluid blending
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 16,
            6, 26,
            7.5, 40,
            9, 58,
            11, 80,
          ],
          'heatmap-opacity': 0.92,
        },
      });

      // --- SATELLITE RADAR / SAR SPECKLE STIPPLE LAYER ---
      // Adds the realistic granular scatter texture seen in satellite debris radar returns
      map.addLayer({
        id: 'debris-scatter-layer',
        type: 'circle',
        source: 'debris-heatmap-src',
        minzoom: 6.2,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6.2, 1.2,
            7.5, 2.4,
            9, 3.8,
            11, 5.5,
          ],
          'circle-color': [
            'match',
            ['get', 'level'],
            'high', '#EF4444',
            'moderate', '#F97316',
            'low', '#FACC15',
            '#00E5FF',
          ],
          'circle-opacity': 0.65,
          'circle-blur': 0.45,
        },
      });
    }

    // 2. ADD FAN BURST RAYS FROM SINKING LOCATION
    const fanLinesGeoJSON = getFanBurstLinesGeoJSON();
    if (!map.getSource('fan-burst-src')) {
      map.addSource('fan-burst-src', {
        type: 'geojson',
        data: fanLinesGeoJSON,
      });

      map.addLayer({
        id: 'fan-burst-layer',
        type: 'line',
        source: 'fan-burst-src',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1.8,
          'line-dasharray': [3, 3],
          'line-opacity': 0.7,
        },
      });
    }

    // 3. CONCENTRATION POLYGON ISO-ZONES (For alternate contour-zones mode)
    const concentrationGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { level: 'low' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [75.0, 9.9],
                [75.5, 9.7],
                [76.0, 9.2],
                [76.4, 8.7],
                [77.0, 8.0],
                [77.8, 7.6],
                [78.5, 7.8],
                [79.5, 8.7],
                [79.6, 9.3],
                [79.0, 9.1],
                [78.2, 8.5],
                [77.6, 7.9],
                [77.0, 8.2],
                [76.5, 9.0],
                [76.0, 9.7],
                [75.3, 10.1],
                [75.0, 9.9],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { level: 'moderate' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [75.1, 9.8],
                [75.6, 9.6],
                [76.1, 9.3],
                [76.5, 8.8],
                [77.2, 8.1],
                [77.7, 8.0],
                [78.2, 8.4],
                [79.4, 9.2],
                [79.2, 9.3],
                [78.4, 8.8],
                [77.7, 8.3],
                [77.1, 8.4],
                [76.4, 9.2],
                [75.9, 9.7],
                [75.2, 9.9],
                [75.1, 9.8],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { level: 'high' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [75.15, 9.8],
                [75.8, 9.65],
                [76.25, 9.45],
                [76.6, 9.0],
                [76.9, 8.5],
                [77.5, 8.05],
                [77.6, 8.35],
                [77.0, 8.7],
                [76.4, 9.4],
                [75.9, 9.75],
                [75.15, 9.8],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { level: 'high' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [79.0, 9.15],
                [79.45, 9.25],
                [79.55, 9.1],
                [79.15, 8.95],
                [79.0, 9.15],
              ],
            ],
          },
        },
      ],
    };

    if (!map.getSource('concentration-poly-src')) {
      map.addSource('concentration-poly-src', { type: 'geojson', data: concentrationGeoJSON });

      map.addLayer({
        id: 'conc-low-layer',
        type: 'fill',
        source: 'concentration-poly-src',
        filter: ['==', 'level', 'low'],
        paint: { 'fill-color': '#FACC15', 'fill-opacity': 0.35 },
      });

      map.addLayer({
        id: 'conc-mod-layer',
        type: 'fill',
        source: 'concentration-poly-src',
        filter: ['==', 'level', 'moderate'],
        paint: { 'fill-color': '#FB923C', 'fill-opacity': 0.5 },
      });

      map.addLayer({
        id: 'conc-high-layer',
        type: 'fill',
        source: 'concentration-poly-src',
        filter: ['==', 'level', 'high'],
        paint: { 'fill-color': '#EF4444', 'fill-opacity': 0.65 },
      });
    }

    // 4. 5-DAY PREDICTED DRIFT PATHS (INCOIS MODELS)
    // Matched exactly to the reference image:
    // Day 1 (White), Day 2 (Cyan), Day 3 (Green), Day 4 (Yellow), Day 5 (Orange)
    const driftPathsGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        // Coastal Trajectory
        {
          type: 'Feature',
          properties: { day: 1, color: '#FFFFFF' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.1, 9.8],
              [75.6, 9.6],
              [76.0, 9.4],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 2, color: '#00E5FF' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [76.0, 9.4],
              [76.4, 9.0],
              [76.8, 8.6],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 3, color: '#00E676' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [76.8, 8.6],
              [77.2, 8.2],
              [77.5, 8.05],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 4, color: '#FACC15' }, // Yellow matching image
          geometry: {
            type: 'LineString',
            coordinates: [
              [77.5, 8.05],
              [78.0, 8.3],
              [78.5, 8.7],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 5, color: '#FF6D00' }, // Orange matching image
          geometry: {
            type: 'LineString',
            coordinates: [
              [78.5, 8.7],
              [79.0, 9.0],
              [79.4, 9.2],
            ],
          },
        },

        // Offshore Secondary Trajectory (Arabian Sea / Outer Indian Ocean Arc)
        {
          type: 'Feature',
          properties: { day: 1, color: '#FFFFFF' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.1, 9.8],
              [75.3, 9.2],
              [75.5, 8.5],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 2, color: '#00E5FF' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.5, 8.5],
              [75.8, 7.9],
              [76.2, 7.5],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 3, color: '#00E676' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [76.2, 7.5],
              [76.7, 7.3],
              [77.3, 7.25],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 4, color: '#FACC15' }, // Yellow matching image
          geometry: {
            type: 'LineString',
            coordinates: [
              [77.3, 7.25],
              [77.9, 7.3],
              [78.5, 7.5],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 5, color: '#FF6D00' }, // Orange matching image
          geometry: {
            type: 'LineString',
            coordinates: [
              [78.5, 7.5],
              [79.1, 7.8],
              [79.6, 8.2],
            ],
          },
        },
      ],
    };

    if (!map.getSource('drift-paths-src')) {
      map.addSource('drift-paths-src', { type: 'geojson', data: driftPathsGeoJSON });

      const dayColors: Record<number, string> = {
        1: '#FFFFFF',
        2: '#00E5FF',
        3: '#00E676',
        4: '#FACC15',
        5: '#FF6D00',
      };

      [1, 2, 3, 4, 5].forEach((d) => {
        map.addLayer({
          id: `drift-line-day${d}`,
          type: 'line',
          source: 'drift-paths-src',
          filter: ['==', 'day', d],
          paint: {
            'line-color': dayColors[d],
            'line-width': 3.5,
            'line-dasharray': [4, 3],
          },
        });
      });
    }
  };

  // Update dynamic layers and interactive HTML markers
  const updateMapDisplay = () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    clearMarkers();

    const isDetectionActive = layers.aiDetection;

    // Heatmap visibility according to mode
    const showHeat = isDetectionActive && (heatmapMode === 'satellite-thermal' || heatmapMode === 'pure-heatmap');
    const showScatter = isDetectionActive && heatmapMode === 'satellite-thermal';
    const showPoly = isDetectionActive && heatmapMode === 'contour-zones';

    if (map.getLayer('debris-heatmap-layer')) {
      map.setLayoutProperty('debris-heatmap-layer', 'visibility', showHeat ? 'visible' : 'none');
      // Update heatmap intensity dynamically
      map.setPaintProperty('debris-heatmap-layer', 'heatmap-intensity', [
        'interpolate',
        ['linear'],
        ['zoom'],
        4, 1.2 * heatIntensity,
        7, 2.2 * heatIntensity,
        9, 3.4 * heatIntensity,
        12, 4.5 * heatIntensity,
      ]);
    }

    if (map.getLayer('debris-scatter-layer')) {
      map.setLayoutProperty('debris-scatter-layer', 'visibility', showScatter ? 'visible' : 'none');
    }

    if (map.getLayer('fan-burst-layer')) {
      map.setLayoutProperty('fan-burst-layer', 'visibility', isDetectionActive ? 'visible' : 'none');
    }

    ['conc-low-layer', 'conc-mod-layer', 'conc-high-layer'].forEach((lId) => {
      if (map.getLayer(lId)) {
        map.setLayoutProperty(lId, 'visibility', showPoly ? 'visible' : 'none');
      }
    });

    // Drift line layers
    const driftVisible = layers.predictedDrift ? 'visible' : 'none';
    [1, 2, 3, 4, 5].forEach((d) => {
      const lId = `drift-line-day${d}`;
      if (map.getLayer(lId)) {
        map.setLayoutProperty(lId, 'visibility', driftVisible);
      }
    });

    // --- 1. SINKING LOCATION CALLOUT & MARKER ---
    // Exact replica of the reference image: Red boxed cross with label callout
    const incidentEl = document.createElement('div');
    incidentEl.className = 'select-none cursor-pointer';
    incidentEl.innerHTML = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <!-- Pulsing heat core ring -->
        <div style="position: absolute; top: 58px; width: 42px; height: 42px; border-radius: 50%; background: rgba(239, 68, 68, 0.45); filter: blur(4px); ${
          isPulsing ? 'animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''
        }"></div>

        <!-- High-contrast callout box -->
        <div style="background: rgba(10, 15, 29, 0.95); backdrop-filter: blur(10px); border: 1.5px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 6px 12px; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.8); min-width: 175px; text-align: center; margin-bottom: 6px;">
          <div style="font-size: 11px; font-weight: 900; color: #FFFFFF; letter-spacing: 0.5px;">MSC ELSA 3</div>
          <div style="font-size: 11px; font-weight: 800; color: #F8FAFC; margin-top: 1px;">Sinking Location</div>
          <div style="font-size: 9.5px; color: #94A3B8; margin-top: 2px;">(24–25 May 2025)</div>
        </div>

        <!-- Red square border with Red 'X' matching reference image -->
        <div style="width: 26px; height: 26px; border: 2.5px solid #EF4444; background: rgba(10, 15, 29, 0.85); border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(239, 68, 68, 0.9);">
          <span style="color: #EF4444; font-weight: 900; font-size: 16px; line-height: 1;">✕</span>
        </div>
      </div>
    `;

    const incidentMarker = new maplibregl.Marker({ element: incidentEl })
      .setLngLat([75.1, 9.8])
      .addTo(map);
    markersRef.current.push(incidentMarker);

    // --- 2. DRIFT DIRECTIONAL ARROWS ---
    if (layers.predictedDrift) {
      const arrowCoords = [
        // Coastal trajectory arrows
        { lng: 75.6, lat: 9.6, angle: 125, color: '#FFFFFF' }, // Day 1
        { lng: 76.4, lat: 9.0, angle: 135, color: '#00E5FF' }, // Day 2
        { lng: 77.2, lat: 8.2, angle: 145, color: '#00E676' }, // Day 3
        { lng: 78.0, lat: 8.3, angle: 55, color: '#FACC15' },  // Day 4 (Yellow)
        { lng: 79.0, lat: 9.0, angle: 45, color: '#FF6D00' },  // Day 5 (Orange)

        // Offshore trajectory arrows
        { lng: 75.3, lat: 9.2, angle: 155, color: '#FFFFFF' },
        { lng: 75.8, lat: 7.9, angle: 130, color: '#00E5FF' },
        { lng: 76.7, lat: 7.3, angle: 95, color: '#00E676' },
        { lng: 77.9, lat: 7.3, angle: 75, color: '#FACC15' },
        { lng: 79.1, lat: 7.8, angle: 50, color: '#FF6D00' },
      ];

      arrowCoords.forEach((arr) => {
        const arrEl = document.createElement('div');
        arrEl.style.transform = `rotate(${arr.angle}deg)`;
        arrEl.style.color = arr.color;
        arrEl.style.fontSize = '17px';
        arrEl.style.fontWeight = '900';
        arrEl.style.textShadow = '0 0 8px rgba(0,0,0,0.95), 0 0 2px black';
        arrEl.style.pointerEvents = 'none';
        arrEl.innerText = '➤';

        const arrMarker = new maplibregl.Marker({ element: arrEl })
          .setLngLat([arr.lng, arr.lat])
          .addTo(map);
        markersRef.current.push(arrMarker);
      });

      // Active Timeline Badge
      const activePoint = DRIFT_TRAJECTORY_DATA[currentStep];
      const activeEl = document.createElement('div');
      activeEl.innerHTML = `
        <div style="background: #00E5FF; color: #071A33; padding: 4px 10px; border-radius: 20px; font-weight: 900; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 14px rgba(0,229,255,0.7); cursor: pointer; white-space: nowrap;">
          📍 Active Step: ${activePoint.timeStep} (${activePoint.displacementKm} km)
        </div>
      `;

      const activeMarker = new maplibregl.Marker({ element: activeEl })
        .setLngLat([activePoint.lng, activePoint.lat])
        .addTo(map);
      markersRef.current.push(activeMarker);
    }

    // --- 3. COASTAL CITY LABELS ---
    COASTAL_CITIES.forEach((city) => {
      const cityEl = document.createElement('div');
      cityEl.className = 'select-none pointer-events-none flex items-center gap-1.5';
      cityEl.innerHTML = `
        <div style="width: 7px; height: 7px; background: white; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.9);"></div>
        <span style="color: white; font-size: 12px; font-weight: 800; text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 2px black, 0 0 8px black; letter-spacing: 0.2px;">
          ${city.name}
        </span>
      `;

      const cityMarker = new maplibregl.Marker({ element: cityEl })
        .setLngLat([city.lng, city.lat])
        .addTo(map);
      markersRef.current.push(cityMarker);
    });

    // --- 4. CARTOGRAPHIC GEOGRAPHIC REGIONAL LABELS ---
    REGIONAL_LABELS.forEach((reg) => {
      const regEl = document.createElement('div');
      regEl.className = 'select-none pointer-events-none';

      if (reg.style === 'country') {
        regEl.innerHTML = `
          <span style="color: rgba(255, 255, 255, 0.85); font-size: 18px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 2px 8px rgba(0,0,0,0.9);">
            ${reg.text}
          </span>
        `;
      } else if (reg.style === 'state') {
        regEl.innerHTML = `
          <span style="color: rgba(255, 255, 255, 0.75); font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-shadow: 0 1px 6px rgba(0,0,0,0.95);">
            ${reg.text}
          </span>
        `;
      } else {
        // Waterbodies (Arabian Sea, Indian Ocean, Gulf of Mannar)
        regEl.innerHTML = `
          <span style="color: rgba(224, 242, 254, 0.85); font-style: italic; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 2px 8px rgba(0,0,0,0.95);">
            ${reg.text}
          </span>
        `;
      }

      const regMarker = new maplibregl.Marker({ element: regEl })
        .setLngLat([reg.lng, reg.lat])
        .addTo(map);
      markersRef.current.push(regMarker);
    });

    // --- 5. ACCUMULATION HOTSPOTS LAYER ---
    if (layers.accumulationHotspots) {
      HOTSPOT_ZONES.forEach((spot) => {
        const isSelected = selectedHotspotId === spot.id;
        const colorMap: Record<string, string> = {
          High: '#EF4444',
          Medium: '#F97316',
          Watch: '#10B981',
          HIGH: '#EF4444',
          MEDIUM: '#F97316',
          WATCH: '#10B981',
        };
        const color = colorMap[spot.priority] || '#EF4444';

        const hotspotEl = document.createElement('div');
        hotspotEl.style.cursor = 'pointer';
        hotspotEl.innerHTML = `
          <div style="background: ${color}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(0,0,0,0.6); ${
            isSelected ? 'outline: 4px solid #00E5FF; transform: scale(1.25);' : ''
          }">
            0${spot.rank}
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 14 }).setHTML(`
          <div style="padding: 6px; color: #071A33;">
            <div style="font-size: 10px; font-weight: 900; color: ${color}; text-transform: uppercase;">HOTSPOT 0${spot.rank} · ${spot.priority} PRIORITY</div>
            <div style="font-size: 13px; font-weight: 800; color: #071A33; margin-top: 2px;">${spot.name}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 4px;">Confidence: <strong>${spot.confidence}%</strong> | Est Area: <strong>${spot.estimatedAreaKm2} km²</strong></div>
          </div>
        `);

        hotspotEl.addEventListener('click', () => {
          if (onSelectHotspot) onSelectHotspot(spot);
        });

        const marker = new maplibregl.Marker({ element: hotspotEl })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(popup)
          .addTo(map);
        markersRef.current.push(marker);
      });
    }

    // --- 6. VERIFICATION POINTS LAYER ---
    if (layers.verificationPoints) {
      VERIFICATION_CANDIDATES.forEach((cand) => {
        const verEl = document.createElement('div');
        verEl.style.cursor = 'pointer';
        verEl.innerHTML = `
          <div style="background: rgba(15, 23, 42, 0.95); color: #00E5FF; border-radius: 8px; padding: 4px 8px; font-weight: 900; font-size: 10px; border: 1.5px solid #00E5FF; box-shadow: 0 4px 12px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 4px;">
            <span>🎯 ${cand.priorityLevel}</span>
            <span style="color: white; font-size: 9px;">${cand.distanceOffshoreKm}km</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
          <div style="padding: 6px; color: #071A33;">
            <div style="font-size: 10px; font-weight: 900; color: #10B981;">VERIFICATION CANDIDATE (${cand.priorityLevel})</div>
            <div style="font-size: 12px; font-weight: 800; color: #071A33; margin-top: 2px;">${cand.zoneCode}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 4px;">Information Gain: <strong>${cand.expectedInformationGain}</strong> | Asset: <strong>${cand.recommendedAsset}</strong></div>
          </div>
        `);

        verEl.addEventListener('click', () => {
          if (onSelectVerification) onSelectVerification(cand);
        });

        const marker = new maplibregl.Marker({ element: verEl })
          .setLngLat([cand.lng, cand.lat])
          .setPopup(popup)
          .addTo(map);
        markersRef.current.push(marker);
      });
    }

    // --- 7. OCEAN CURRENTS & WIND VECTORS ---
    if (layers.oceanCurrents || layers.wind) {
      const vectorCoords = [
        { lat: 9.7, lng: 75.4, angle: 135 },
        { lat: 9.1, lng: 75.9, angle: 140 },
        { lat: 8.5, lng: 76.4, angle: 130 },
        { lat: 8.0, lng: 77.1, angle: 110 },
        { lat: 8.2, lng: 78.1, angle: 60 },
        { lat: 8.8, lng: 78.9, angle: 45 },
      ];

      vectorCoords.forEach((v) => {
        const vectorEl = document.createElement('div');
        vectorEl.style.transform = `rotate(${v.angle}deg)`;
        vectorEl.style.color = layers.oceanCurrents ? '#00E5FF' : '#A855F7';
        vectorEl.style.opacity = '0.85';
        vectorEl.style.fontSize = '18px';
        vectorEl.style.fontWeight = '900';
        vectorEl.style.textShadow = '0 0 6px black';
        vectorEl.style.pointerEvents = 'none';
        vectorEl.innerText = '➔';

        const vectorMarker = new maplibregl.Marker({ element: vectorEl })
          .setLngLat([v.lng, v.lat])
          .addTo(map);
        markersRef.current.push(vectorMarker);
      });
    }
  };

  useEffect(() => {
    updateMapDisplay();
  }, [layers, currentStep, selectedHotspotId, heatmapMode, heatIntensity, isPulsing]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl ${className}`}>
      {/* MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950" />


      {/* TOP-RIGHT HEATMAP CONTROLLER BAR */}
      <div className="absolute top-4 right-14 z-10 hidden sm:flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-700/70 p-1.5 rounded-xl shadow-xl select-none">
        <div className="flex items-center gap-1 px-1.5 text-[11px] font-bold text-slate-300 border-r border-slate-700 pr-2">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Heat Effect</span>
        </div>

        <button
          onClick={() => setHeatmapMode('satellite-thermal')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            heatmapMode === 'satellite-thermal'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Satellite Thermal KDE + Radar Speckle Particle Layer"
        >
          Satellite Plume
        </button>

        <button
          onClick={() => setHeatmapMode('pure-heatmap')}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            heatmapMode === 'pure-heatmap'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Continuous Gaussian Thermal KDE Blending"
        >
          Smooth KDE
        </button>

        <button
          onClick={() => setHeatmapMode('contour-zones')}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            heatmapMode === 'contour-zones'
              ? 'bg-slate-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Iso-density Risk Zones"
        >
          Iso-Zones
        </button>

        <div className="flex items-center gap-1 pl-1 border-l border-slate-700">
          <button
            onClick={() => setHeatIntensity((prev) => (prev >= 1.6 ? 0.8 : prev + 0.4))}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold cursor-pointer"
            title="Adjust Thermal Heat Multiplier"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span>{heatIntensity.toFixed(1)}x</span>
          </button>

          <button
            onClick={() => setIsPulsing((prev) => !prev)}
            className={`p-1 rounded text-[10px] font-bold cursor-pointer ${
              isPulsing ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Sonar & Heat Breathing Pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT SLICK REFERENCE LEGEND (Exact copy of reference image) */}
      <div className={`absolute bottom-4 left-4 z-10 bg-slate-950/95 backdrop-blur-md border border-slate-700/80 text-white shadow-2xl transition-all select-none ${isLegendOpen ? 'rounded-xl p-3.5 w-64' : 'rounded-xl p-2.5 w-auto cursor-pointer hover:bg-slate-900/95'}`} onClick={() => !isLegendOpen && setIsLegendOpen(true)}>
        <div className={`flex items-center justify-between ${isLegendOpen ? 'mb-3 pb-2 border-b border-slate-800' : ''}`}>
          {isLegendOpen ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-cyan-400" /> MAP LEGEND</span>
          ) : (
            <div className="flex items-center gap-2" title="Open Map Legend">
              <Info className="w-5 h-5 text-cyan-400" />
            </div>
          )}
          {isLegendOpen && (
            <button onClick={(e) => { e.stopPropagation(); setIsLegendOpen(false); }} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-sm hover:bg-slate-800" title="Close Legend">
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {isLegendOpen && (
          <div className="space-y-3.5">
            {/* DEBRIS CONCENTRATION SCALE */}
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                <span>Debris Concentration</span>
              <span className="text-[9px] text-slate-400 font-normal lowercase">(from Satellite)</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 rounded-sm bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0"></span>
                <span className="text-[11px] font-bold text-slate-100">High</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 rounded-sm bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.8)] shrink-0"></span>
                <span className="text-[11px] font-bold text-slate-100">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 rounded-sm bg-[#FACC15] shadow-[0_0_8px_rgba(250,204,21,0.8)] shrink-0"></span>
                <span className="text-[11px] font-bold text-slate-100">Low</span>
              </div>
            </div>
          </div>

          {/* PREDICTED DRIFT PATH (INCOIS MODELS) */}
          <div className="pt-2.5 border-t border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>Predicted Drift Path</span>
              <span className="text-[9px] text-slate-400 font-normal">(INCOIS Models)</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="tracking-tighter text-white font-mono">-- -- ➤</span>
                </div>
                <span>Day 1</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#00E5FF]">
                <div className="flex items-center gap-1.5">
                  <span className="tracking-tighter font-mono">-- -- ➤</span>
                </div>
                <span>Day 2</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#00E676]">
                <div className="flex items-center gap-1.5">
                  <span className="tracking-tighter font-mono">-- -- ➤</span>
                </div>
                <span>Day 3</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#FACC15]">
                <div className="flex items-center gap-1.5">
                  <span className="tracking-tighter font-mono">-- -- ➤</span>
                </div>
                <span>Day 4</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#FF6D00]">
                <div className="flex items-center gap-1.5">
                  <span className="tracking-tighter font-mono">-- -- ➤</span>
                </div>
                <span>Day 5</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* BOTTOM-RIGHT SCALE BAR & NORTH ARROW (Matching reference image) */}
      <div className="absolute bottom-4 right-4 z-10 flex items-end gap-3 pointer-events-none select-none">
        {/* Kilometric Scale */}
        <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 rounded px-2.5 py-1 text-white text-right">
          <div className="flex items-center justify-between gap-3 text-[9px] font-mono text-slate-300 mb-0.5">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>200 km</span>
          </div>
          <div className="w-28 h-1 bg-white border border-slate-900 flex">
            <div className="w-1/4 h-full bg-slate-900"></div>
            <div className="w-1/4 h-full bg-white"></div>
            <div className="w-1/2 h-full bg-slate-900"></div>
          </div>
        </div>

        {/* North Arrow */}
        <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 rounded px-2 py-1 flex flex-col items-center">
          <span className="text-xs text-white leading-none">▲</span>
          <span className="text-[10px] font-black text-white leading-tight">N</span>
        </div>
      </div>
    </div>
  );
};
