import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { FeatureCollection } from 'geojson';
import { ActiveLayers } from './LayerControl';
import { TimelineStep, HotspotZone, VerificationCandidate, NavigationId } from '../types';
import { DRIFT_TRAJECTORY_DATA, HOTSPOT_ZONES, VERIFICATION_CANDIDATES } from '../data/mockData';
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
  const activePopupRef = useRef<maplibregl.Popup | null>(null);
  const isLoadedRef = useRef(false);

  // Default camera center and zoom for Kerala Coast / Arabian Sea
  const DEFAULT_CENTER: [number, number] = [76.15, 10.12];
  const DEFAULT_ZOOM = 8.4;

  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('satellite-thermal');
  const [heatIntensity, setHeatIntensity] = useState<number>(1.2);
  const [isPulsing, setIsPulsing] = useState<boolean>(true);

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
      center: [76.5, 9.1], // Centered around Kerala / Arabian Sea / Kanyakumari / Southern India
      zoom: 7.2,
      attributionControl: false,
    });

    map.on('load', () => {
      isLoadedRef.current = true;
      initMapSourcesAndLayers();
      updateLayerVisibility();
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
    if (activePopupRef.current) {
      activePopupRef.current.remove();
      activePopupRef.current = null;
    }
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetView = () => {
    mapRef.current?.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 1000 });
  };

  // Generate smooth rectangular polygon surrounding a coordinate
  const createBoundingBoxPolygon = (lng: number, lat: number, widthLng = 0.08, heightLat = 0.06) => [
    [
      [lng - widthLng / 2, lat + heightLat / 2],
      [lng + widthLng / 2, lat + heightLat / 2],
      [lng + widthLng / 2, lat - heightLat / 2],
      [lng - widthLng / 2, lat - heightLat / 2],
      [lng - widthLng / 2, lat + heightLat / 2],
    ],
  ];

  const initMapSourcesAndLayers = () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    // --- 1. CONCENTRATION ZONES GEOJSON (High 🔴, Moderate 🟠, Low 🟡) ---
    const concentrationGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { level: 'low', name: 'Low Concentration Zone' },
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
        // MODERATE CONCENTRATION ZONE (Mid belt)
        {
          type: 'Feature',
          properties: { level: 'moderate', name: 'Moderate Concentration Zone' },
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
        // HIGH CONCENTRATION ZONE (Nearshore Kerala & Coastal Hotspots)
        {
          type: 'Feature',
          properties: { level: 'high', name: 'High Concentration Zone' },
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
        // HIGH CONCENTRATION ZONE (Dhanushkodi plume)
        {
          type: 'Feature',
          properties: { level: 'high', name: 'High Concentration Plume (Dhanushkodi)' },
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
        id: 'conc-high-layer',
        type: 'fill',
        source: 'concentration-src',
        filter: ['==', 'level', 'low'],
        paint: {
          'fill-color': '#FACC15',
          'fill-opacity': 0.4,
        },
      });

      map.addLayer({
        id: 'conc-mod-layer',
        type: 'fill',
        source: 'concentration-src',
        filter: ['==', 'level', 'moderate'],
        paint: {
          'fill-color': '#FB923C',
          'fill-opacity': 0.55,
        },
      });

      // High concentration fill
      map.addLayer({
        id: 'hotspot-zone-fill',
        type: 'fill',
        source: 'concentration-src',
        filter: ['==', 'level', 'high'],
        paint: {
          'fill-color': '#EF4444',
          'fill-opacity': 0.7,
        },
      });
    }

    // --- 2. 5-DAY PREDICTED DRIFT PATHS GEOJSON ---
    const driftPathsGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        // Coastal Drift Trajectory (Primary Path)
        // Day 1 (White)
        {
          type: 'Feature',
          properties: { day: 1, color: '#FFFFFF', name: 'Day 1 Drift' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.8, 9.85],
              [76.045, 10.052],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 2, color: '#00E5FF', name: 'Day 2 Drift' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [76.045, 10.052],
              [76.182, 10.158],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 3, color: '#00E676', name: 'Day 3 Drift' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [76.182, 10.158],
              [76.321, 10.284],
            ],
          },
        },
        // Day 4 (Blue)
        {
          type: 'Feature',
          properties: { day: 4, color: '#2979FF', name: 'Day 4 Drift' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.3, 9.4],
              [75.55, 9.65],
              [75.8, 9.9],
              [76.05, 10.15],
              [76.3, 10.4],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 5, color: '#FF6D00', name: 'Day 5 Drift' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.15, 9.6],
              [75.4, 9.85],
              [75.65, 10.1],
              [75.9, 10.35],
              [76.15, 10.6],
            ],
          },
        },

        // Offshore Secondary Drift Trajectory (Arabian Sea / Indian Ocean Outer Arc)
        // Day 1 Offshore
        {
          type: 'Feature',
          properties: { name: 'Shelf Jet Streamline 3' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.45, 9.25],
              [75.7, 9.5],
              [75.95, 9.75],
              [76.2, 10.0],
              [76.45, 10.25],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { name: 'Outer Shelf Vector Streamline 4' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.0, 9.85],
              [75.25, 10.1],
              [75.5, 10.35],
              [75.75, 10.6],
            ],
          },
        },
        // Day 3 Offshore
        {
          type: 'Feature',
          properties: { name: 'Surface Wind Streamline 1' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.2, 9.3],
              [75.52, 9.62],
              [75.85, 9.95],
              [76.18, 10.28],
              [76.5, 10.6],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 4, color: '#2979FF' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.35, 9.15],
              [75.68, 9.48],
              [76.01, 9.81],
              [76.34, 10.14],
              [76.67, 10.47],
            ],
          },
        },
        {
          type: 'Feature',
          properties: { day: 5, color: '#FF6D00' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [75.05, 9.75],
              [75.38, 10.08],
              [75.71, 10.41],
              [76.04, 10.74],
            ],
          },
        },
      ],
    };

    if (!map.getSource('drift-paths-src')) {
      map.addSource('drift-paths-src', { type: 'geojson', data: driftPathsGeoJSON });

      // Add line layer for day 1
      map.addLayer({
        id: 'drift-line-day1',
        type: 'line',
        source: 'drift-paths-src',
        filter: ['==', 'day', 1],
        paint: { 'line-color': '#FFFFFF', 'line-width': 3.5, 'line-dasharray': [4, 3] },
      });
      map.addLayer({
        id: 'drift-line-day2',
        type: 'line',
        source: 'drift-paths-src',
        filter: ['==', 'day', 2],
        paint: { 'line-color': '#00E5FF', 'line-width': 3.5, 'line-dasharray': [4, 3] },
      });
      map.addLayer({
        id: 'drift-line-day3',
        type: 'line',
        source: 'drift-paths-src',
        filter: ['==', 'day', 3],
        paint: { 'line-color': '#00E676', 'line-width': 3.5, 'line-dasharray': [4, 3] },
      });
      map.addLayer({
        id: 'drift-line-day4',
        type: 'line',
        source: 'drift-paths-src',
        filter: ['==', 'day', 4],
        paint: { 'line-color': '#2979FF', 'line-width': 3.5, 'line-dasharray': [4, 3] },
      });
      map.addLayer({
        id: 'drift-line-day5',
        type: 'line',
        source: 'drift-paths-src',
        filter: ['==', 'day', 5],
        paint: { 'line-color': '#FF6D00', 'line-width': 3.5, 'line-dasharray': [4, 3] },
      });
    }

    updateLayerVisibility();
  };

  const updateLayerVisibility = () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    clearMarkers();

    // Toggle Concentration Layers
    const concLayers = ['conc-low-layer', 'conc-mod-layer', 'conc-high-layer'];
    concLayers.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          'visibility',
          layers.aiDetection ? 'visible' : 'none'
        );
      }
    });

    // Toggle Drift Path Layers
    const driftLayers = [
      'drift-line-day1',
      'drift-line-day2',
      'drift-line-day3',
      'drift-line-day4',
      'drift-line-day5',
    ];
    driftLayers.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          'visibility',
          layers.predictedDrift ? 'visible' : 'none'
        );
      }
    });

    // --- 1. SINKING INCIDENT ORIGIN MARKER & CALLOUT ---
    const incidentEl = document.createElement('div');
    incidentEl.className = 'select-none cursor-pointer';
    incidentEl.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(8px); border: 1.5px solid #EF4444; border-radius: 8px; padding: 6px 10px; color: white; box-shadow: 0 8px 20px rgba(0,0,0,0.6); max-width: 190px;">
          <div style="font-size: 10px; font-weight: 900; color: #EF4444; letter-spacing: 0.5px;">MSC ELSA 3</div>
          <div style="font-size: 11px; font-weight: 800; color: #F8FAFC; margin-top: 1px;">Sinking Location</div>
          <div style="font-size: 9px; color: #94A3B8; margin-top: 2px;">(24–25 May 2025)</div>
        </div>
        <div style="width: 28px; height: 28px; background: #EF4444; border: 2.5px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 14px; margin-top: -6px; box-shadow: 0 0 16px rgba(239, 68, 68, 0.9);">
          ✕
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
        // Primary coastal path arrows
        { lng: 75.6, lat: 9.6, angle: 125, color: '#FFFFFF' }, // Day 1
        { lng: 76.4, lat: 9.0, angle: 135, color: '#00E5FF' }, // Day 2
        { lng: 77.2, lat: 8.2, angle: 145, color: '#00E676' }, // Day 3
        { lng: 78.0, lat: 8.3, angle: 55, color: '#2979FF' },  // Day 4
        { lng: 79.0, lat: 9.0, angle: 45, color: '#FF6D00' },  // Day 5

        // Offshore path arrows
        { lng: 75.3, lat: 9.2, angle: 155, color: '#FFFFFF' },
        { lng: 75.8, lat: 7.9, angle: 130, color: '#00E5FF' },
        { lng: 76.7, lat: 7.3, angle: 95, color: '#00E676' },
        { lng: 77.9, lat: 7.3, angle: 75, color: '#2979FF' },
        { lng: 79.1, lat: 7.8, angle: 50, color: '#FF6D00' },
      ];

      arrowCoords.forEach((arr) => {
        const arrEl = document.createElement('div');
        arrEl.style.transform = `rotate(${arr.angle}deg)`;
        arrEl.style.color = arr.color;
        arrEl.style.fontSize = '15px';
        arrEl.style.fontWeight = '900';
        arrEl.style.textShadow = '0 0 6px rgba(0,0,0,0.9)';
        arrEl.style.pointerEvents = 'none';
        arrEl.innerText = '➤';

        const arrMarker = new maplibregl.Marker({ element: arrEl })
          .setLngLat([arr.lng, arr.lat])
          .addTo(map);

        markersRef.current.push(arrMarker);
      });

      // Active timeline step marker badge
      const activePoint = DRIFT_TRAJECTORY_DATA[currentStep];
      const activeEl = document.createElement('div');
      activeEl.innerHTML = `
        <div style="background: #00E5FF; color: #071A33; padding: 4px 10px; border-radius: 20px; font-weight: 900; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 14px rgba(0,229,255,0.6); cursor: pointer; white-space: nowrap;">
          📍 Active: ${activePoint.timeStep} (${activePoint.displacementKm} km)
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 12, maxWidth: '210px' }).setHTML(`
        <div style="padding: 6px; color: #071A33;">
          <div style="font-size: 10px; font-weight: 900; color: #EF4444; text-transform: uppercase;">DETECTED DEBRIS START</div>
          <div style="font-size: 12px; font-weight: 800; color: #071A33; margin-top: 2px;">Arabian Sea · Off Kerala</div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">Area: <strong>4.8 km²</strong> | Confidence: <strong>86%</strong></div>
        </div>
      `);

      const debrisEl = document.createElement('div');
      debrisEl.className = 'select-none cursor-pointer';
      debrisEl.innerHTML = `
  <div style="width: 22px; height: 22px; border: 2.5px solid #EF4444; background: rgba(10,15,29,0.9); border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(239,68,68,0.9);">
    <span style="color: #EF4444; font-weight: 900; font-size: 14px;">✕</span>
  </div>
`;
      const debrisMarker = new maplibregl.Marker({ element: debrisEl })
        .setLngLat([75.8, 9.85])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(debrisMarker);

    } // closes if (layers.predictedDrift)

    // --- 3. GEOGRAPHIC COASTAL CITY LABELS ---
    const cityLabels = [
      { name: 'Kochi', lng: 76.27, lat: 9.93 },
      { name: 'Alappuzha', lng: 76.33, lat: 9.49 },
      { name: 'Kollam', lng: 76.58, lat: 8.89 },
      { name: 'Thiruvananthapuram', lng: 76.95, lat: 8.52 },
      { name: 'Kanyakumari', lng: 77.55, lat: 8.08 },
      { name: 'Rameswaram', lng: 79.3, lat: 9.28 },
      { name: 'Dhanushkodi', lng: 79.42, lat: 9.17 },
    ];

    cityLabels.forEach((city) => {
      const cityEl = document.createElement('div');
      cityEl.className = 'select-none pointer-events-none flex items-center gap-1.5';
      cityEl.innerHTML = `
        <div style="width: 7px; height: 7px; background: white; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.8);"></div>
        <span style="color: white; font-size: 11px; font-weight: 800; text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 2px black;">${city.name}</span>
      `;

      const cityMarker = new maplibregl.Marker({ element: cityEl })
        .setLngLat([city.lng, city.lat])
        .addTo(map);

      markersRef.current.push(cityMarker);
    });

    // --- 4. ACCUMULATION HOTSPOTS LAYER ---
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
          <div style="background: ${color}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(0,0,0,0.5); ${isSelected ? 'outline: 4px solid #00E5FF; transform: scale(1.25);' : ''
          }">
            0${spot.rank}
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 14 }).setHTML(`
          <div style="padding: 6px; color: #071A33;">
            <div style="font-size: 10px; font-weight: 900; color: #EF4444; text-transform: uppercase;">HOTSPOT 0${spot.rank} · ${spot.priority} RISK</div>
            <div style="font-size: 13px; font-weight: 900; color: #071A33; margin-top: 2px;">${spot.name}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 4px;">Confidence: <strong>${spot.confidence}%</strong> | Est Area: <strong>${spot.estimatedAreaKm2} km²</strong></div>
            <div style="font-size: 10px; color: #0878D1; font-weight: 800; margin-top: 4px;">Expected Arrival: ~${spot.forecastArrivalHours} hrs</div>
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

    // --- 5. VERIFICATION POINTS LAYER ---
    if (layers.verificationPoints) {
      VERIFICATION_CANDIDATES.slice(0, 2).forEach((cand) => {
        const verEl = document.createElement('div');
        verEl.className = 'select-none cursor-pointer';
        verEl.innerHTML = `
          <div style="background: #10B981; color: white; border-radius: 12px; padding: 3px 8px; font-weight: 900; font-size: 10px; border: 1.5px solid white; box-shadow: 0 4px 14px rgba(16,185,129,0.6); white-space: nowrap;">
            <span>📍 🟢 BEST PLACE TO CHECK</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 12, maxWidth: '220px' }).setHTML(`
          <div style="padding: 6px; color: #071A33;">
            <div style="font-size: 10px; font-weight: 900; color: #10B981; text-transform: uppercase;">BEST PLACE TO CHECK</div>
            <div style="font-size: 12px; font-weight: 800; color: #071A33; margin-top: 2px;">${cand.distanceOffshoreKm} km offshore · Kerala Coast</div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px;">Recommended Asset: <strong>${cand.recommendedAsset}</strong></div>
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

    // --- 6. OCEAN CURRENTS & WIND VECTORS ---
    if (layers.oceanCurrents || layers.wind) {
      const vectorCoords = [
        { lat: 9.7, lng: 75.4, angle: 135, speed: '0.42 m/s', dir: 'SE', name: 'Kerala Coastal Current', temp: '28.4°C', depth: 'Surface' },
        { lat: 9.1, lng: 75.9, angle: 140, speed: '0.38 m/s', dir: 'SE', name: 'Southwest Coastal Flow', temp: '28.1°C', depth: 'Surface' },
        { lat: 8.5, lng: 76.4, angle: 130, speed: '0.35 m/s', dir: 'SE', name: 'Trivandrum Current', temp: '27.9°C', depth: 'Surface' },
        { lat: 8.0, lng: 77.1, angle: 110, speed: '0.31 m/s', dir: 'ESE', name: 'Kanyakumari Current', temp: '27.7°C', depth: 'Surface' },
        { lat: 8.2, lng: 78.1, angle: 60, speed: '0.28 m/s', dir: 'NE', name: 'Gulf of Mannar Flow', temp: '28.0°C', depth: 'Surface' },
        { lat: 8.8, lng: 78.9, angle: 45, speed: '0.25 m/s', dir: 'NE', name: 'Palk Strait Flow', temp: '28.2°C', depth: 'Surface' },
      ];

      vectorCoords.forEach((node) => {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'select-none cursor-pointer';
        nodeEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 5px; background: rgba(15, 23, 42, 0.92); border: 1.5px solid #24C6C5; border-radius: 12px; padding: 3px 8px; color: #24C6C5; font-size: 10px; font-weight: 800; box-shadow: 0 4px 12px rgba(36, 198, 197, 0.4); backdrop-filter: blur(4px);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#24C6C5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg); shrink: 0;">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            <span>🌊 ${node.speed} (${node.dir})</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 10, maxWidth: '220px' }).setHTML(`
          <div style="padding: 6px; color: #071A33;">
            <div style="font-size: 10px; font-weight: 900; color: #24C6C5; text-transform: uppercase;">CMEMS OCEAN SURFACE CURRENT</div>
            <div style="font-size: 12px; font-weight: 900; color: #071A33; margin-top: 2px;">${node.name}</div>
            <div style="font-size: 11px; color: #334155; margin-top: 4px;">Velocity: <strong>${node.speed}</strong> | Direction: <strong>${node.dir}</strong></div>
            <div style="font-size: 10px; color: #64748B; margin-top: 2px;">SST: ${node.temp} · Depth: ${node.depth}</div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: nodeEl })
          .setLngLat([node.lng, node.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  };

  useEffect(() => {
    updateLayerVisibility();
  }, [layers, currentStep, selectedHotspotId]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl ${className}`}>
      {/* MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950" />

      {/* TOP-LEFT HEADER BANNER OVERLAY */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white rounded-xl p-3.5 shadow-2xl max-w-xs pointer-events-none select-none">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold tracking-tight text-white">Potential Risk & Drift Zones</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Next 5 Days (Illustrative)
          </span>
        </div>
        <p className="text-xs font-semibold text-cyan-400 mt-0.5">
          MSC ELSA 3 Incident (Off Kerala)
        </p>
      </div>

      {/* BOTTOM-LEFT COMPACT LEGEND OVERLAY */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white rounded-xl p-3 shadow-2xl w-60 select-none">
        <div className="space-y-3">
          {/* DEBRIS CONCENTRATION SCALE */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Debris Concentration</span>
              <span className="text-[9px] text-slate-400 font-normal">(from Satellite)</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                <span className="text-[10px] font-bold text-slate-200">High</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                <span className="text-[10px] font-bold text-slate-200">Mod</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0"></span>
                <span className="text-[10px] font-bold text-slate-200">Low</span>
              </div>
            </div>
          </div>

          {/* DRIFT FORECAST DAY KEYS */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Predicted Drift Path</span>
              <span className="text-[9px] text-slate-400 font-normal">(5-Day)</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center text-[9px] font-bold">
              <div className="flex flex-col items-center gap-0.5">
                <span className="w-full h-1 bg-white rounded-full"></span>
                <span className="text-slate-300">Day 1</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="w-full h-1 bg-[#00E5FF] rounded-full"></span>
                <span className="text-slate-300">Day 2</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="w-full h-1 bg-[#00E676] rounded-full"></span>
                <span className="text-slate-300">Day 3</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="w-full h-1 bg-[#2979FF] rounded-full"></span>
                <span className="text-slate-300">Day 4</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="w-full h-1 bg-[#FF6D00] rounded-full"></span>
                <span className="text-slate-300">Day 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
