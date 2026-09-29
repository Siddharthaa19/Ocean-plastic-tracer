export type NavigationId =
  | 'overview'
  | 'detection'
  | 'drift'
  | 'hotspots'
  | 'verification'
  | 'historical'
  | 'settings';

export type TimelineStep = 'NOW' | '12H' | '24H' | '48H' | '72H';

export interface DebrisDetection {
  id: string;
  name: string;
  locationName: string;
  lat: number;
  lng: number;
  confidence: number;
  visibleExtentKm2: number;
  driftWindowHours: string;
  priority: 'High' | 'Medium' | 'Low';
  satelliteSource: string;
  timestamp: string;
  spectralSignatureScore: number;
  spatialConsistency: number;
  oceanCurrentConvergence: string;
  windAgreement: string;
  historicalContext: string;
  status: 'Confirmed' | 'Needs Check' | 'Under Review';
}

export interface DriftTrajectoryPoint {
  timeStep: TimelineStep;
  hours: number;
  lat: number;
  lng: number;
  uncertaintyRadiusKm: number;
  currentSpeedKnots: number;
  currentDirDeg: number;
  windSpeedKmh: number;
  windDirDeg: number;
  displacementKm: number;
}

export interface HotspotZone {
  id: string;
  rank: number;
  name: string;
  lat: number;
  lng: number;
  priority: 'High' | 'Medium' | 'Watch';
  confidence: number;
  estimatedAreaKm2: number;
  forecastArrivalHours: number;
  accessibility: 'Good' | 'Moderate' | 'Easy' | 'Challenging';
  recommendedMethod: string;
}

export interface VerificationCandidate {
  id: string;
  zoneCode: string;
  lat: number;
  lng: number;
  distanceOffshoreKm: number;
  potentialDebrisLikelihood: 'High' | 'Medium' | 'Low';
  modelUncertainty: 'High' | 'Medium' | 'Low';
  expectedInformationGain: 'High' | 'Medium' | 'Low';
  recommendedAsset: 'Boat / Drone' | 'Support Vessel' | 'Coastal Radar' | 'Satellite Pass';
  priorityLevel: 'P1' | 'P2' | 'P3';
  status: 'Needs Check' | 'Confirmed Debris' | 'Cleared Zone';
}

export interface SatelliteSceneItem {
  id: string;
  satellite: 'Sentinel-2 A/B' | 'PlanetScope' | 'Landsat-9';
  sensorType: 'Multispectral (10m)' | 'SuperDove (3m)' | 'OLI-2 (15m)';
  acquisitionDate: string;
  cloudCoverPct: number;
  resolutionMeters: number;
  qualityScore: number;
  fciIndex: number;
  thumbnailUrl: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Location' | 'Detection' | 'Incident' | 'Hotspot' | 'Verification';
  subtitle: string;
  targetNav: NavigationId;
}
