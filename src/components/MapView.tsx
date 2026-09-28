import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { ActiveLayers } from './LayerControl';
import { TimelineStep, HotspotZone, VerificationCandidate, NavigationId } from '../types';
import { DRIFT_TRAJECTORY_DATA, HOTSPOT_ZONES, VERIFICATION_CANDIDATES } from '../data/mockData';
import { ArrowRight, Plus, Minus, RotateCcw } from 'lucide-react';

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

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Publicly accessible high-resolution Satellite basemap (Esri World Imagery - NO API KEY REQUIRED)
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
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    map.on('load', () => {
      isLoadedRef.current = true;
      initMapDataAndLayers();
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

  const initMapDataAndLayers = () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    // --- 1. DETECTED DEBRIS AREA (Red/Orange Translucent Polygon Core) ---
    const concentrationGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { level: 'high', name: 'Detected Debris Core (4.8 km²)' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [75.75, 9.92],
                [75.92, 9.88],
                [76.02, 9.80],
                [75.88, 9.75],
                [75.75, 9.92],
              ],
            ],
          },
        },
      ],
    };

    if (!map.getSource('concentration-src')) {
      map.addSource('concentration-src', { type: 'geojson', data: concentrationGeoJSON });

      map.addLayer({
        id: 'conc-high-layer',
        type: 'fill',
        source: 'concentration-src',
        paint: {
          'fill-color': '#EF4444',
          'fill-opacity': 0.55,
        },
      });

      map.addLayer({
        id: 'conc-high-stroke',
        type: 'line',
        source: 'concentration-src',
        paint: {
          'line-color': '#FF8A8A',
          'line-width': 2,
        },
      });
    }

    // --- 2. ACCUMULATION HOTSPOTS POLYGONS (Matched strictly to HOTSPOT_ZONES in mockData.ts) ---
    const hotspotsGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: HOTSPOT_ZONES.map((spot) => ({
        type: 'Feature',
        properties: {
          id: spot.id,
          name: spot.name,
          rank: spot.rank,
          priority: spot.priority,
        },
        geometry: {
          type: 'Polygon',
          coordinates: createBoundingBoxPolygon(spot.lng, spot.lat, 0.12, 0.08),
        },
      })),
    };

    if (!map.getSource('hotspots-geo-src')) {
      map.addSource('hotspots-geo-src', { type: 'geojson', data: hotspotsGeoJSON });

      map.addLayer({
        id: 'hotspot-zone-fill',
        type: 'fill',
        source: 'hotspots-geo-src',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'id'], selectedHotspotId || ''],
            '#EF4444',
            '#F97316',
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'id'], selectedHotspotId || ''],
            0.75,
            0.35,
          ],
        },
      });

      map.addLayer({
        id: 'hotspot-zone-outline',
        type: 'line',
        source: 'hotspots-geo-src',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'id'], selectedHotspotId || ''],
            '#00E5FF',
            '#EF4444',
          ],
          'line-width': [
            'case',
            ['==', ['get', 'id'], selectedHotspotId || ''],
            4,
            2,
          ],
        },
      });
    }

    // --- 3. MAIN PREDICTED DRIFT LINE CONNECTING DEBRIS TO HOTSPOTS ---
    const mainDriftGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { segment: '24h' },
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
          properties: { segment: '48h' },
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
          properties: { segment: '72h' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [76.182, 10.158],
              [76.321, 10.284],
            ],
          },
        },
      ],
    };

    if (!map.getSource('main-drift-src')) {
      map.addSource('main-drift-src', { type: 'geojson', data: mainDriftGeoJSON });

      map.addLayer({
        id: 'drift-line-24h',
        type: 'line',
        source: 'main-drift-src',
        filter: ['==', 'segment', '24h'],
        paint: { 'line-color': '#00E5FF', 'line-width': 4 },
      });
      map.addLayer({
        id: 'drift-line-48h',
        type: 'line',
        source: 'main-drift-src',
        filter: ['==', 'segment', '48h'],
        paint: { 'line-color': '#2979FF', 'line-width': 4 },
      });
      map.addLayer({
        id: 'drift-line-72h',
        type: 'line',
        source: 'main-drift-src',
        filter: ['==', 'segment', '72h'],
        paint: { 'line-color': '#00E676', 'line-width': 4 },
      });
    }

    // --- 4. OCEAN CURRENTS VECTOR STREAMLINES (CMEMS Data) ---
    const oceanCurrentsGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Coastal Current Streamline 1' },
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
          properties: { name: 'Offshore Surface Current Streamline 2' },
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
      ],
    };

    if (!map.getSource('ocean-currents-src')) {
      map.addSource('ocean-currents-src', { type: 'geojson', data: oceanCurrentsGeoJSON });

      map.addLayer({
        id: 'ocean-currents-line-bg',
        type: 'line',
        source: 'ocean-currents-src',
        paint: {
          'line-color': '#24C6C5',
          'line-width': 6,
          'line-opacity': 0.25,
        },
      });

      map.addLayer({
        id: 'ocean-currents-line-main',
        type: 'line',
        source: 'ocean-currents-src',
        paint: {
          'line-color': '#24C6C5',
          'line-width': 2.5,
          'line-dasharray': [4, 3],
          'line-opacity': 0.9,
        },
      });
    }

    // --- 5. WIND VECTOR STREAMLINES (GFS Atmospheric Data) ---
    const windVectorGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
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
          properties: { name: 'Surface Wind Streamline 2' },
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
          properties: { name: 'Coastal Wind Drift Streamline 3' },
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

    if (!map.getSource('wind-vector-src')) {
      map.addSource('wind-vector-src', { type: 'geojson', data: windVectorGeoJSON });

      map.addLayer({
        id: 'wind-vector-line-bg',
        type: 'line',
        source: 'wind-vector-src',
        paint: {
          'line-color': '#A855F7',
          'line-width': 5,
          'line-opacity': 0.25,
        },
      });

      map.addLayer({
        id: 'wind-vector-line-main',
        type: 'line',
        source: 'wind-vector-src',
        paint: {
          'line-color': '#A855F7',
          'line-width': 2.2,
          'line-dasharray': [6, 4],
          'line-opacity': 0.9,
        },
      });
    }

    // --- 6. SATELLITE SCENE BOUNDARY OVERLAY ---
    const satelliteGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Sentinel-2 Satellite Scene' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [75.3, 9.4],
                [76.25, 9.4],
                [76.25, 10.35],
                [75.3, 10.35],
                [75.3, 9.4],
              ],
            ],
          },
        },
      ],
    };

    if (!map.getSource('satellite-scene-src')) {
      map.addSource('satellite-scene-src', { type: 'geojson', data: satelliteGeoJSON });

      map.addLayer({
        id: 'satellite-scene-fill',
        type: 'fill',
        source: 'satellite-scene-src',
        paint: {
          'fill-color': '#00E5FF',
          'fill-opacity': 0.15,
        },
      });

      map.addLayer({
        id: 'satellite-scene-outline',
        type: 'line',
        source: 'satellite-scene-src',
        paint: {
          'line-color': '#00E5FF',
          'line-width': 2,
          'line-dasharray': [4, 4],
        },
      });
    }

    updateLayerVisibility();
  };

  const updateLayerVisibility = () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    clearMarkers();

    // Toggle Satellite Overlay
    ['satellite-scene-fill', 'satellite-scene-outline'].forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', showSatelliteOverlay ? 'visible' : 'none');
      }
    });

    // Toggle Debris Layer
    ['conc-high-layer', 'conc-high-stroke'].forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', layers.aiDetection ? 'visible' : 'none');
      }
    });

    // Toggle Ocean Currents Layer
    ['ocean-currents-line-bg', 'ocean-currents-line-main'].forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', layers.oceanCurrents ? 'visible' : 'none');
      }
    });

    // Toggle Wind Vector Layer
    ['wind-vector-line-bg', 'wind-vector-line-main'].forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', layers.wind ? 'visible' : 'none');
      }
    });

    // Toggle Hotspot Layer & Dynamic Highlight
    if (map.getLayer('hotspot-zone-fill')) {
      map.setLayoutProperty('hotspot-zone-fill', 'visibility', layers.accumulationHotspots ? 'visible' : 'none');
      map.setPaintProperty('hotspot-zone-fill', 'fill-color', [
        'case',
        ['==', ['get', 'id'], selectedHotspotId || ''],
        '#EF4444',
        '#F97316',
      ]);
      map.setPaintProperty('hotspot-zone-fill', 'fill-opacity', [
        'case',
        ['==', ['get', 'id'], selectedHotspotId || ''],
        0.75,
        0.35,
      ]);
    }

    if (map.getLayer('hotspot-zone-outline')) {
      map.setLayoutProperty('hotspot-zone-outline', 'visibility', layers.accumulationHotspots ? 'visible' : 'none');
      map.setPaintProperty('hotspot-zone-outline', 'line-color', [
        'case',
        ['==', ['get', 'id'], selectedHotspotId || ''],
        '#00E5FF',
        '#EF4444',
      ]);
      map.setPaintProperty('hotspot-zone-outline', 'line-width', [
        'case',
        ['==', ['get', 'id'], selectedHotspotId || ''],
        4,
        2,
      ]);
    }

    // Toggle Drift Line
    ['drift-line-24h', 'drift-line-48h', 'drift-line-72h'].forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', layers.predictedDrift ? 'visible' : 'none');
      }
    });

    // --- STAGE 01: INCIDENT MARKER ONLY ---
    if (showIncidentOnly) {
      const incidentEl = document.createElement('div');
      incidentEl.className = 'select-none cursor-pointer';
      incidentEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; background: #071A33; border: 2px solid #00E5FF; border-radius: 20px; padding: 6px 14px; color: white; box-shadow: 0 0 20px rgba(0,229,255,0.6); font-weight: 900; font-size: 11px; white-space: nowrap;">
          <span style="font-size: 14px;">🚢</span>
          <span>MSC ELSA 3 · INCIDENT LOCATION</span>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 12, maxWidth: '240px' }).setHTML(`
        <div style="padding: 6px; color: #071A33;">
          <div style="font-size: 10px; font-weight: 900; color: #0878D1; text-transform: uppercase;">HISTORICAL MARINE INCIDENT</div>
          <div style="font-size: 13px; font-weight: 900; color: #071A33; margin-top: 2px;">MSC ELSA 3</div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">Location: <strong>Arabian Sea · Kerala Coast</strong></div>
          <div style="font-size: 10px; color: #64748B; margin-top: 2px;">Event Date: 12 May 2025</div>
        </div>
      `);

      const incidentMarker = new maplibregl.Marker({ element: incidentEl })
        .setLngLat([75.8, 9.85])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(incidentMarker);
    }

    // --- STAGE 02: SATELLITE PASS MARKER ---
    if (showSatelliteOverlay) {
      const satEl = document.createElement('div');
      satEl.className = 'select-none cursor-pointer';
      satEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #00E5FF; border-radius: 16px; padding: 4px 12px; color: #00E5FF; font-size: 11px; font-weight: 900; box-shadow: 0 4px 14px rgba(0,229,255,0.4);">
          <span>📡 SENTINEL-2 A/B SATELLITE PASS (10m Res)</span>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 12, maxWidth: '220px' }).setHTML(`
        <div style="padding: 6px; color: #071A33;">
          <div style="font-size: 10px; font-weight: 900; color: #00E5FF; text-transform: uppercase;">SATELLITE OBSERVATION</div>
          <div style="font-size: 12px; font-weight: 800; color: #071A33; margin-top: 2px;">Sentinel-2 Multispectral Scene</div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px;">Pass Time: 13 May 2025 · 10:30 UTC</div>
        </div>
      `);

      const satMarker = new maplibregl.Marker({ element: satEl })
        .setLngLat([75.8, 10.25])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(satMarker);
    }

    // --- 1. STARTING POSITION DEBRIS MARKER ---
    if (layers.aiDetection) {
      const debrisEl = document.createElement('div');
      debrisEl.className = 'select-none cursor-pointer';
      debrisEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #EF4444; border-radius: 20px; padding: 4px 10px; color: white; box-shadow: 0 4px 14px rgba(239,68,68,0.6); white-space: nowrap;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #EF4444; display: inline-block; animation: pulse 1.5s infinite;"></span>
          <span style="font-size: 10px; font-weight: 900; letter-spacing: 0.5px;">🔴 DETECTED DEBRIS (4.8 km²)</span>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 12, maxWidth: '210px' }).setHTML(`
        <div style="padding: 6px; color: #071A33;">
          <div style="font-size: 10px; font-weight: 900; color: #EF4444; text-transform: uppercase;">DETECTED DEBRIS START</div>
          <div style="font-size: 12px; font-weight: 800; color: #071A33; margin-top: 2px;">Arabian Sea · Off Kerala</div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">Area: <strong>4.8 km²</strong> | Confidence: <strong>86%</strong></div>
        </div>
      `);

      const debrisMarker = new maplibregl.Marker({ element: debrisEl })
        .setLngLat([75.8, 9.85])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(debrisMarker);
    }

    // --- 2. PREDICTED DRIFT MARKERS (24H, 48H, 72H) ---
    if (layers.predictedDrift) {
      const driftPoints = [
        { label: '24H', lng: 76.045, lat: 10.052, color: '#00E5FF', dist: '16 km', dir: 'NE', time: '1 Day Forecast' },
        { label: '48H', lng: 76.182, lat: 10.158, color: '#2979FF', dist: '31 km', dir: 'NE', time: '2 Days Forecast' },
        { label: '72H', lng: 76.321, lat: 10.284, color: '#00E676', dist: '47 km', dir: 'NE', time: '3 Days Forecast' },
      ];

      driftPoints.forEach((pt) => {
        const isCurrentActive =
          (currentStep === '24H' && pt.label === '24H') ||
          (currentStep === '48H' && pt.label === '48H') ||
          (currentStep === '72H' && pt.label === '72H');

        const ptEl = document.createElement('div');
        ptEl.className = 'select-none cursor-pointer';

        if (isCurrentActive) {
          ptEl.innerHTML = `
            <div style="display: flex; items-center; gap: 6px; background: #0878D1; color: white; border-radius: 16px; padding: 4px 10px; font-weight: 900; font-size: 11px; border: 2px solid ${pt.color}; box-shadow: 0 0 20px rgba(0,229,255,0.9); transform: scale(1.15);">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${pt.color}; display: inline-block;"></span>
              <span>📍 ACTIVE: ${pt.label} (${pt.dist})</span>
            </div>
          `;
        } else {
          ptEl.innerHTML = `
            <div style="display: flex; items-center; gap: 4px; background: rgba(15, 23, 42, 0.95); border: 2px solid ${pt.color}; border-radius: 14px; padding: 3px 8px; color: ${pt.color}; font-size: 10px; font-weight: 900; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
              <span>${pt.label}</span>
            </div>
          `;
        }

        const popup = new maplibregl.Popup({ offset: 10, maxWidth: '200px' }).setHTML(`
          <div style="padding: 6px; color: #071A33;">
            <div style="font-size: 10px; font-weight: 900; color: ${pt.color}; text-transform: uppercase;">${pt.label} DRIFT FORECAST</div>
            <div style="font-size: 12px; font-weight: 800; color: #071A33; margin-top: 2px;">Expected displacement: ${pt.dist}</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 2px;">Trajectory Direction: ${pt.dir}</div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: ptEl })
          .setLngLat([pt.lng, pt.lat])
          .setPopup(popup)
          .addTo(map);

        if (isCurrentActive && !selectedHotspotId) {
          popup.addTo(map);
          activePopupRef.current = popup;
        }

        markersRef.current.push(marker);
      });
    }

    // --- 3. ACCUMULATION HOTSPOTS MARKERS (Dynamically Linked to HOTSPOT_ZONES) ---
    if (layers.accumulationHotspots) {
      HOTSPOT_ZONES.forEach((spot) => {
        const isSelected = selectedHotspotId === spot.id;
        const hotspotEl = document.createElement('div');
        hotspotEl.className = 'select-none cursor-pointer';

        if (isSelected) {
          hotspotEl.innerHTML = `
            <div style="display: flex; items-center; gap: 6px; background: #EF4444; color: white; border-radius: 16px; padding: 5px 12px; font-weight: 900; font-size: 11px; border: 2px solid #00E5FF; box-shadow: 0 0 20px rgba(0,229,255,0.9); transform: scale(1.15);">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #00E5FF; display: inline-block;"></span>
              <span>📍 ACTIVE: 0${spot.rank} ${spot.name} (${spot.confidence}%)</span>
            </div>
          `;
        } else {
          hotspotEl.innerHTML = `
            <div style="background: rgba(249, 115, 22, 0.9); color: white; border-radius: 12px; padding: 2.5px 8px; font-weight: 900; font-size: 10px; border: 1.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); white-space: nowrap;">
              <span>🟠 0${spot.rank} ${spot.name}</span>
            </div>
          `;
        }

        const popup = new maplibregl.Popup({ offset: 12, maxWidth: '240px' }).setHTML(`
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

        if (isSelected) {
          popup.addTo(map);
          activePopupRef.current = popup;
        }

        markersRef.current.push(marker);
      });
    }

    // --- 4. VERIFICATION POINTS LAYER ---
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

    // --- 5. OCEAN CURRENTS MARKERS LAYER (CMEMS Surface Flow Grid) ---
    if (layers.oceanCurrents) {
      const oceanCurrentNodes = [
        { name: 'CMEMS Station Alpha (Kerala Shelf)', lng: 75.55, lat: 9.65, speed: '0.52 m/s', dir: '45° NE', temp: '29.1°C', depth: '0.5m Surface' },
        { name: 'CMEMS Station Beta (Offshore Drift)', lng: 75.8, lat: 9.9, speed: '0.48 m/s', dir: '48° NE', temp: '29.3°C', depth: '0.5m Surface' },
        { name: 'CMEMS Station Gamma (Kochi Jet)', lng: 76.05, lat: 10.15, speed: '0.55 m/s', dir: '42° NE', temp: '28.9°C', depth: '0.5m Surface' },
        { name: 'CMEMS Station Delta (Malabar Front)', lng: 75.4, lat: 9.85, speed: '0.45 m/s', dir: '50° NE', temp: '29.0°C', depth: '0.5m Surface' },
      ];

      oceanCurrentNodes.forEach((node) => {
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

    // --- 6. WIND VECTOR MARKERS LAYER (GFS Atmosphere Surface Drift) ---
    if (layers.wind) {
      const windNodes = [
        { name: 'GFS Wind Grid 01 (South Arabian Sea)', lng: 75.35, lat: 9.45, speed: '18 km/h', dir: '45° NE', gusts: '24 km/h', driftCoeff: '2.8%' },
        { name: 'GFS Wind Grid 02 (Offshore Kerala)', lng: 75.7, lat: 9.75, speed: '21 km/h', dir: '50° NE', gusts: '27 km/h', driftCoeff: '3.0%' },
        { name: 'GFS Wind Grid 03 (Central Channel)', lng: 76.0, lat: 10.05, speed: '19 km/h', dir: '48° NE', gusts: '25 km/h', driftCoeff: '2.9%' },
        { name: 'GFS Wind Grid 04 (North Coastal Vector)', lng: 76.35, lat: 10.35, speed: '23 km/h', dir: '52° NE', gusts: '30 km/h', driftCoeff: '3.1%' },
      ];

      windNodes.forEach((node) => {
        const windEl = document.createElement('div');
        windEl.className = 'select-none cursor-pointer';
        windEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 5px; background: rgba(15, 23, 42, 0.92); border: 1.5px solid #A855F7; border-radius: 12px; padding: 3px 8px; color: #C084FC; font-size: 10px; font-weight: 800; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4); backdrop-filter: blur(4px);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C084FC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(50deg); shrink: 0;">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            <span>💨 ${node.speed} (${node.dir})</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 10, maxWidth: '220px' }).setHTML(`
          <div style="padding: 6px; color: #071A33;">
            <div style="font-size: 10px; font-weight: 900; color: #A855F7; text-transform: uppercase;">GFS WIND VECTOR DRIFT</div>
            <div style="font-size: 12px; font-weight: 900; color: #071A33; margin-top: 2px;">${node.name}</div>
            <div style="font-size: 11px; color: #334155; margin-top: 4px;">Speed: <strong>${node.speed}</strong> | Gusts: <strong>${node.gusts}</strong></div>
            <div style="font-size: 10px; color: #64748B; margin-top: 2px;">Bearing: ${node.dir} · Windage factor: ${node.driftCoeff}</div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: windEl })
          .setLngLat([node.lng, node.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  };

  useEffect(() => {
    updateLayerVisibility();

    if (mapRef.current) {
      if (selectedHotspotId) {
        const spot = HOTSPOT_ZONES.find((h) => h.id === selectedHotspotId);
        if (spot) {
          mapRef.current.flyTo({
            center: [spot.lng, spot.lat],
            zoom: 9.8,
            duration: 1200,
          });
        }
      } else if (currentStep) {
        const stepCoords: Record<TimelineStep, [number, number]> = {
          NOW: [75.8, 9.85],
          '12H': [75.9, 9.95],
          '24H': [76.045, 10.052],
          '48H': [76.182, 10.158],
          '72H': [76.321, 10.284],
        };
        const target = stepCoords[currentStep] || DEFAULT_CENTER;
        mapRef.current.flyTo({
          center: target,
          zoom: 9.2,
          duration: 1000,
        });
      }
    }
  }, [layers, currentStep, selectedHotspotId]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl ${className}`}>
      {/* MAP CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950" />

      {/* TOP-RIGHT ACTION BUTTON & ZOOM CONTROLS */}
      <div className="absolute top-3 right-3 z-10 select-none flex items-center gap-2">
        {onNavigate && (
          <button
            onClick={() => onNavigate('drift')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0878D1] hover:bg-[#0766B3] text-white text-xs font-bold shadow-lg transition-all cursor-pointer transform active:scale-95 border border-cyan-400/30"
          >
            <span>VIEW FORECAST</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Zoom & Reset View Controls */}
        <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-0.5 shadow-lg text-white">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-slate-700 my-auto mx-0.5" />
          <button
            onClick={handleResetView}
            title="Reset View to Kerala Coast"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
