import {
  DebrisDetection,
  DriftTrajectoryPoint,
  HotspotZone,
  VerificationCandidate,
  SatelliteSceneItem,
  SearchResultItem,
  TimelineStep,
} from '../types';

export const DEMO_DISCLAIMER_TEXT =
  'Demonstration dataset based on satellite imagery and ocean current models. Not real-time verified plastic mass.';

export const PRIMARY_DETECTION: DebrisDetection = {
  id: 'DET-2026-408',
  name: 'Detected Marine Debris Cluster',
  locationName: 'Arabian Sea · Kerala Coast',
  lat: 9.9312,
  lng: 75.8045,
  confidence: 86,
  visibleExtentKm2: 4.8,
  driftWindowHours: '24–48 hrs',
  priority: 'High',
  satelliteSource: 'Sentinel-2 Satellite (10m)',
  timestamp: '27 Sep 2026 · 09:20 UTC',
  spectralSignatureScore: 91,
  spatialConsistency: 84,
  oceanCurrentConvergence: 'High ocean convergence (0.32 s⁻¹)',
  windAgreement: 'Strong wind alignment (18 km/h NE)',
  historicalContext: 'Known seasonal accumulation area along Kerala Shelf',
  status: 'Confirmed',
};

export const DRIFT_TRAJECTORY_DATA: Record<TimelineStep, DriftTrajectoryPoint> = {
  NOW: {
    timeStep: 'NOW',
    hours: 0,
    lat: 9.9312,
    lng: 75.8045,
    uncertaintyRadiusKm: 1.2,
    currentSpeedKnots: 1.4,
    currentDirDeg: 135,
    windSpeedKmh: 18,
    windDirDeg: 45,
    displacementKm: 0,
  },
  '12H': {
    timeStep: '12H',
    hours: 12,
    lat: 9.985,
    lng: 75.921,
    uncertaintyRadiusKm: 2.8,
    currentSpeedKnots: 1.5,
    currentDirDeg: 130,
    windSpeedKmh: 19,
    windDirDeg: 50,
    displacementKm: 18,
  },
  '24H': {
    timeStep: '24H',
    hours: 24,
    lat: 10.052,
    lng: 76.045,
    uncertaintyRadiusKm: 4.5,
    currentSpeedKnots: 1.6,
    currentDirDeg: 125,
    windSpeedKmh: 21,
    windDirDeg: 52,
    displacementKm: 25,
  },
  '48H': {
    timeStep: '48H',
    hours: 48,
    lat: 10.158,
    lng: 76.182,
    uncertaintyRadiusKm: 7.2,
    currentSpeedKnots: 1.8,
    currentDirDeg: 120,
    windSpeedKmh: 23,
    windDirDeg: 55,
    displacementKm: 31,
  },
  '72H': {
    timeStep: '72H',
    hours: 72,
    lat: 10.284,
    lng: 76.321,
    uncertaintyRadiusKm: 11.4,
    currentSpeedKnots: 1.9,
    currentDirDeg: 118,
    windSpeedKmh: 25,
    windDirDeg: 58,
    displacementKm: 47,
  },
};

export const HOTSPOT_ZONES: HotspotZone[] = [
  {
    id: 'HOT-01',
    rank: 1,
    name: 'Kerala Shelf (Zone A)',
    lat: 10.052,
    lng: 76.045,
    priority: 'High',
    confidence: 89,
    estimatedAreaKm2: 6.2,
    forecastArrivalHours: 24,
    accessibility: 'Good',
    recommendedMethod: 'Support Vessel + Drone Check',
  },
  {
    id: 'HOT-02',
    rank: 2,
    name: 'Coastal Convergence Zone (Zone B)',
    lat: 10.158,
    lng: 76.182,
    priority: 'High',
    confidence: 84,
    estimatedAreaKm2: 4.1,
    forecastArrivalHours: 36,
    accessibility: 'Easy',
    recommendedMethod: 'Inshore Recovery Skimmer',
  },
  {
    id: 'HOT-03',
    rank: 3,
    name: 'Offshore Current Boundary (Zone C)',
    lat: 10.284,
    lng: 76.321,
    priority: 'Watch',
    confidence: 76,
    estimatedAreaKm2: 3.5,
    forecastArrivalHours: 48,
    accessibility: 'Moderate',
    recommendedMethod: 'Autonomous Monitoring Boat',
  },
];

export const VERIFICATION_CANDIDATES: VerificationCandidate[] = [
  {
    id: 'VER-101',
    zoneCode: '14 km Offshore (Kerala)',
    lat: 9.965,
    lng: 75.862,
    distanceOffshoreKm: 14,
    potentialDebrisLikelihood: 'High',
    modelUncertainty: 'Medium',
    expectedInformationGain: 'High',
    recommendedAsset: 'Boat / Drone',
    priorityLevel: 'P1',
    status: 'Needs Check',
  },
  {
    id: 'VER-102',
    zoneCode: 'Alappuzha Shore Approach',
    lat: 9.82,
    lng: 75.91,
    distanceOffshoreKm: 8,
    potentialDebrisLikelihood: 'High',
    modelUncertainty: 'Low',
    expectedInformationGain: 'Medium',
    recommendedAsset: 'Boat / Drone',
    priorityLevel: 'P2',
    status: 'Confirmed Debris',
  },
  {
    id: 'VER-103',
    zoneCode: 'Deep Gulf Channel',
    lat: 9.75,
    lng: 75.45,
    distanceOffshoreKm: 42,
    potentialDebrisLikelihood: 'Low',
    modelUncertainty: 'High',
    expectedInformationGain: 'Low',
    recommendedAsset: 'Satellite Pass',
    priorityLevel: 'P3',
    status: 'Cleared Zone',
  },
];

export const SATELLITE_SCENES: SatelliteSceneItem[] = [
  {
    id: 'SCENE-S2B-20260927',
    satellite: 'Sentinel-2 A/B',
    sensorType: 'Multispectral (10m)',
    acquisitionDate: '27 Sep 2026 · 09:20 UTC',
    cloudCoverPct: 4.2,
    resolutionMeters: 10,
    qualityScore: 96,
    fciIndex: 0.78,
    thumbnailUrl: '/floating_marine_plastic_debris.jpg',
  },
  {
    id: 'SCENE-PLN-20260926',
    satellite: 'PlanetScope',
    sensorType: 'SuperDove (3m)',
    acquisitionDate: '26 Sep 2026 · 14:15 UTC',
    cloudCoverPct: 1.8,
    resolutionMeters: 3,
    qualityScore: 94,
    fciIndex: 0.81,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'SCENE-L9-20260925',
    satellite: 'Landsat-9',
    sensorType: 'OLI-2 (15m)',
    acquisitionDate: '25 Sep 2026 · 06:40 UTC',
    cloudCoverPct: 8.5,
    resolutionMeters: 15,
    qualityScore: 88,
    fciIndex: 0.69,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
];

export const GLOBAL_SEARCH_ITEMS: SearchResultItem[] = [
  {
    id: 's1',
    title: 'Arabian Sea · Kerala Coast',
    category: 'Location',
    subtitle: 'Primary Detection Area · Lat 9.93°N Lng 75.80°E',
    targetNav: 'overview',
  },
  {
    id: 's2',
    title: 'DET-2026-408 (Kerala Debris Slick)',
    category: 'Detection',
    subtitle: '86% Detection Confidence · 4.8 km² Detected Area',
    targetNav: 'detection',
  },
  {
    id: 's3',
    title: 'MSC ELSA 3 Incident Replay',
    category: 'Incident',
    subtitle: 'Historical event replay & ocean drift simulation',
    targetNav: 'historical',
  },
  {
    id: 's4',
    title: 'Hotspot 01 — Kerala Shelf',
    category: 'Hotspot',
    subtitle: 'High priority accumulation zone (89% confidence)',
    targetNav: 'hotspots',
  },
  {
    id: 's5',
    title: 'Verification Zone A (14 km Offshore)',
    category: 'Verification',
    subtitle: 'Best Place to Check candidate (P1)',
    targetNav: 'verification',
  },
];

export const AREA_TREND_DATA = [
  { time: '06:00', areaKm2: 3.2, confidence: 81 },
  { time: '09:00', areaKm2: 3.8, confidence: 84 },
  { time: '12:00', areaKm2: 4.2, confidence: 85 },
  { time: '15:00', areaKm2: 4.5, confidence: 86 },
  { time: '18:00', areaKm2: 4.8, confidence: 86 },
  { time: '21:00 (FC)', areaKm2: 5.1, confidence: 84 },
  { time: '00:00 (FC)', areaKm2: 5.4, confidence: 82 },
];

export const FORECAST_DISPLACEMENT_CHART = [
  { step: 'NOW', displacement: 0, uncertainty: 1.2 },
  { step: '12H', displacement: 18, uncertainty: 2.8 },
  { step: '24H', displacement: 25, uncertainty: 4.5 },
  { step: '48H', displacement: 31, uncertainty: 7.2 },
  { step: '72H', displacement: 47, uncertainty: 11.4 },
];

export const MODEL_CONFIDENCE_BREAKDOWN = [
  { module: 'Satellite Reflectance Match', score: 86, color: '#0878D1' },
  { module: 'Ocean Current Physics', score: 81, color: '#24C6C5' },
  { module: 'Wind-Wave Stokes Drift', score: 85, color: '#168BE8' },
  { module: 'Combined Detection Confidence', score: 89, color: '#18B77A' },
];

export const ASSISTANT_FAQ = [
  {
    question: 'Why is this area high priority?',
    answer:
      'The Kerala Offshore Zone shows a strong 86% satellite match for floating debris along with a surface ocean convergence zone. The 48-hour forecast shows movement toward coastal reserves.',
  },
  {
    question: 'Where will the debris move?',
    answer:
      'Over the next 48 hours, detected debris is expected to drift 31 km Northeast along the Kerala Shelf, driven by surface currents and 18 km/h offshore winds.',
  },
  {
    question: 'Where should we check first?',
    answer:
      'The best place to check is candidate VER-101 located 14 km offshore. Sending a boat or drone here will quickly confirm debris before it reaches coastal waters.',
  },
  {
    question: 'What changed since the last satellite pass?',
    answer:
      'Compared to yesterday’s pass, detected debris area increased by +12.4% (from 4.2 km² to 4.8 km²), with ocean currents shifting slightly Northeast.',
  },
];
