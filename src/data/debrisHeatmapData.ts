import type { FeatureCollection, Feature, Point, LineString } from 'geojson';

export interface HeatmapPointProperties {
  intensity: number; // 0.1 to 1.0
  level: 'high' | 'moderate' | 'low' | 'fringe';
  weight: number;
}

// Deterministic pseudo-random number generator for consistent rendering
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates an organic, high-density point distribution mimicking the satellite radar
 * debris concentration plume from the MSC ELSA 3 incident off Kerala, India.
 */
export function getDebrisHeatmapGeoJSON(): FeatureCollection<Point, HeatmapPointProperties> {
  const features: Feature<Point, HeatmapPointProperties>[] = [];
  let seed = 42;

  const addPoint = (lng: number, lat: number, intensity: number, level: HeatmapPointProperties['level']) => {
    features.push({
      type: 'Feature',
      properties: {
        intensity: Math.min(1.0, Math.max(0.05, intensity)),
        level,
        weight: intensity,
      },
      geometry: {
        type: 'Point',
        coordinates: [Number(lng.toFixed(5)), Number(lat.toFixed(5))],
      },
    });
  };

  const addCluster = (
    centerLng: number,
    centerLat: number,
    count: number,
    spreadX: number,
    spreadY: number,
    baseIntensity: number,
    level: HeatmapPointProperties['level']
  ) => {
    for (let i = 0; i < count; i++) {
      const u = pseudoRandom(seed++);
      const v = pseudoRandom(seed++);
      // Box-Muller style approximation for natural dispersion
      const r = Math.sqrt(-2.0 * Math.log(u || 0.001));
      const theta = 2.0 * Math.PI * v;
      const dx = r * Math.cos(theta) * (spreadX / 2.2);
      const dy = r * Math.sin(theta) * (spreadY / 2.2);

      const dist = Math.sqrt((dx / spreadX) ** 2 + (dy / spreadY) ** 2);
      const falloff = Math.max(0.15, 1 - dist * 0.7);
      const intensity = baseIntensity * falloff;

      let ptLevel = level;
      if (intensity > 0.82) ptLevel = 'high';
      else if (intensity > 0.55) ptLevel = 'moderate';
      else if (intensity > 0.28) ptLevel = 'low';
      else ptLevel = 'fringe';

      addPoint(centerLng + dx, centerLat + dy, intensity, ptLevel);
    }
  };

  // 1. SINKING LOCATION CORE (MSC ELSA 3 - 75.1, 9.8)
  addCluster(75.1, 9.8, 45, 0.12, 0.1, 1.0, 'high');
  addCluster(75.18, 9.78, 35, 0.18, 0.14, 0.85, 'high');

  // 2. DISPERSION FAN TOWARDS KERALA COAST (Between Sinking site and Kochi/Alappuzha)
  // Upper fan ray towards Kochi
  for (let step = 0; step <= 15; step++) {
    const t = step / 15;
    const lng = 75.1 + t * (76.2 - 75.1);
    const lat = 9.8 + t * (9.92 - 9.8) + Math.sin(t * Math.PI) * 0.08;
    const spread = 0.08 + t * 0.14;
    addCluster(lng, lat, 14, spread, spread, 0.75 - t * 0.1, 'moderate');
  }

  // Mid fan ray towards Alappuzha (Primary dense plume)
  for (let step = 0; step <= 18; step++) {
    const t = step / 18;
    const lng = 75.15 + t * (76.28 - 75.15);
    const lat = 9.8 - t * (9.8 - 9.55) - Math.sin(t * Math.PI) * 0.05;
    const spread = 0.1 + t * 0.18;
    addCluster(lng, lat, 18, spread, spread, 0.9 - t * 0.1, 'high');
  }

  // Lower fan ray towards Kollam
  for (let step = 0; step <= 14; step++) {
    const t = step / 14;
    const lng = 75.2 + t * (76.45 - 75.2);
    const lat = 9.75 - t * (9.75 - 9.15);
    const spread = 0.12 + t * 0.2;
    addCluster(lng, lat, 12, spread, spread, 0.65 - t * 0.15, 'moderate');
  }

  // 3. KERALA COASTAL HIGH CONCENTRATION STRIP (Kochi -> Alappuzha -> Kollam -> Thiruvananthapuram)
  // Alappuzha Hotspot Core (Highest density and saturation in reference image)
  addCluster(76.28, 9.7, 50, 0.12, 0.25, 1.0, 'high');
  addCluster(76.33, 9.52, 60, 0.14, 0.28, 1.0, 'high');
  addCluster(76.36, 9.42, 45, 0.12, 0.22, 1.0, 'high');

  // Moderate envelope fanning into the Arabian Sea off Alappuzha / Kochi
  addCluster(75.95, 9.65, 40, 0.28, 0.35, 0.65, 'moderate');
  addCluster(75.7, 9.72, 35, 0.35, 0.38, 0.45, 'low');
  addCluster(75.45, 9.8, 30, 0.38, 0.35, 0.35, 'low');

  // Southern Kerala coastal strip (Kollam to Thiruvananthapuram)
  for (let step = 0; step <= 15; step++) {
    const t = step / 15;
    const lng = 76.45 + t * (76.95 - 76.45);
    const lat = 9.15 - t * (9.15 - 8.5);
    // Core hugging shore
    addCluster(lng, lat, 15, 0.1, 0.12, 0.88, 'high');
    // Mid zone seaward
    addCluster(lng - 0.15, lat - 0.05, 12, 0.18, 0.18, 0.6, 'moderate');
    // Outer yellow fringe seaward
    addCluster(lng - 0.35, lat - 0.1, 10, 0.25, 0.25, 0.35, 'low');
  }

  // 4. KANYAKUMARI CAPE COMORIN ACCUMULATION PLUME
  // Radial thermal plume fanning south into the Indian Ocean
  addCluster(77.55, 8.08, 55, 0.2, 0.16, 1.0, 'high');
  addCluster(77.45, 7.95, 40, 0.25, 0.2, 0.85, 'high');
  addCluster(77.65, 7.92, 35, 0.25, 0.2, 0.8, 'high');
  addCluster(77.5, 7.78, 45, 0.38, 0.25, 0.65, 'moderate');
  addCluster(77.35, 7.68, 30, 0.45, 0.3, 0.45, 'low');
  addCluster(77.7, 7.65, 30, 0.45, 0.3, 0.4, 'low');

  // 5. GULF OF MANNAR / DHANUSHKODI / RAMESWARAM PLUME
  // Concentrated plume at Dhanushkodi tip
  addCluster(79.42, 9.17, 50, 0.16, 0.14, 1.0, 'high');
  addCluster(79.3, 9.25, 35, 0.18, 0.16, 0.85, 'high');
  addCluster(79.2, 9.08, 30, 0.22, 0.2, 0.75, 'moderate');
  addCluster(79.0, 8.95, 25, 0.25, 0.22, 0.6, 'moderate');
  addCluster(78.75, 8.8, 25, 0.28, 0.25, 0.5, 'low');
  addCluster(78.4, 8.55, 25, 0.3, 0.28, 0.45, 'low');
  addCluster(78.0, 8.35, 20, 0.3, 0.28, 0.4, 'low');

  // 6. OFFSHORE SECONDARY BELT (ARABIAN SEA / OUTER DRIFT ARC)
  const offshoreArc = [
    { lng: 75.35, lat: 9.1, count: 18, intensity: 0.42 },
    { lng: 75.7, lat: 8.2, count: 18, intensity: 0.38 },
    { lng: 76.4, lat: 7.45, count: 20, intensity: 0.35 },
    { lng: 77.1, lat: 7.28, count: 22, intensity: 0.36 },
    { lng: 78.0, lat: 7.35, count: 18, intensity: 0.35 },
    { lng: 78.7, lat: 7.6, count: 16, intensity: 0.32 },
  ];
  offshoreArc.forEach((pt) => {
    addCluster(pt.lng, pt.lat, pt.count, 0.35, 0.35, pt.intensity, 'low');
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Curved fan burst lines radiating from the sinking site [75.1, 9.8]
 * into the coastal plume, matching the reference image.
 */
export function getFanBurstLinesGeoJSON(): FeatureCollection<LineString> {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: 'fan-1' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [75.1, 9.8],
            [75.4, 9.88],
            [75.8, 9.95],
            [76.22, 9.98],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'fan-2' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [75.1, 9.8],
            [75.5, 9.75],
            [75.9, 9.7],
            [76.3, 9.62],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'fan-3' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [75.1, 9.8],
            [75.55, 9.62],
            [76.0, 9.48],
            [76.35, 9.4],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'fan-4' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [75.1, 9.8],
            [75.6, 9.45],
            [76.1, 9.25],
            [76.5, 9.1],
          ],
        },
      },
    ],
  };
}

/**
 * Coastal cities with exact coordinates as shown in the reference image
 */
export const COASTAL_CITIES = [
  { name: 'Kochi', lng: 76.27, lat: 9.93, align: 'right' as const },
  { name: 'Alappuzha', lng: 76.33, lat: 9.49, align: 'right' as const },
  { name: 'Kollam', lng: 76.58, lat: 8.89, align: 'right' as const },
  { name: 'Thiruvananthapuram', lng: 76.95, lat: 8.52, align: 'right' as const },
  { name: 'Kanyakumari', lng: 77.55, lat: 8.08, align: 'top' as const },
  { name: 'Rameswaram', lng: 79.3, lat: 9.28, align: 'left' as const },
  { name: 'Dhanushkodi', lng: 79.42, lat: 9.17, align: 'right' as const },
];

/**
 * Prominent geographic text labels as in the satellite reference image
 */
export const REGIONAL_LABELS = [
  { text: 'INDIA', lng: 77.6, lat: 9.6, style: 'country' as const },
  { text: 'Kerala', lng: 76.8, lat: 9.2, style: 'state' as const },
  { text: 'Tamil Nadu', lng: 78.4, lat: 9.45, style: 'state' as const },
  { text: 'Arabian Sea', lng: 74.45, lat: 8.85, style: 'sea' as const },
  { text: 'Indian Ocean', lng: 77.1, lat: 7.25, style: 'ocean' as const },
  { text: 'Gulf of Mannar', lng: 79.35, lat: 8.45, style: 'gulf' as const },
];
