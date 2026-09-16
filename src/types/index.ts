export type MovieCategory = 'all' | 'blockbuster' | 'feature' | 'web-series' | 'documentary' | 'indie';
export type NavView = 'home' | 'console' | 'filmography' | 'upcoming' | 'gear' | 'clients' | 'workbench';

export interface MovieProject {
  id: string;
  title: string;
  year: number;
  category: MovieCategory;
  role: 'Lead Audiographer' | 'Re-Recording Mixer' | 'Location Sound Engineer' | 'Foley & SFX Specialist' | 'Sound Designer';
  director: string;
  productionHouse: string;
  posterUrl: string;
  backdropUrl: string;
  soundFormat: 'Dolby Atmos 7.1.4' | 'Auro 3D 11.1' | '5.1 Surround' | 'Binaural Ambisonics';
  awards?: string[];
  synopsis: string;
  soundHighlights: string[];
  recordingGearUsed: string[];
  sampleTrackTitle: string;
  sampleAudioType: 'action' | 'sci-fi' | 'horror' | 'foley' | 'drama';
  duration: string;
  isUpcoming?: boolean;
  productionStage?: 'Location Recording' | 'Foley & Sound Design' | 'ADR Dubbing' | 'Final Re-Recording Mix' | 'Dolby Atmos Mastering';
  releaseTarget?: string;
  completionPercentage?: number;
}

export interface ClientStudio {
  id: string;
  name: string;
  logoText: string;
  category: 'Studio' | 'Streaming Platform' | 'Production House';
  projectsCount: number;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: string;
  rating: number;
  featuredProject: string;
}

export interface GearItem {
  id: string;
  name: string;
  brand: string;
  category: 'Microphone' | 'Field Recorder' | 'Monitors & Headphones' | 'Outboard & Preamps' | 'DAW & DSP';
  specs: string;
  description: string;
  iconName: string;
  inRack: boolean;
  imageBg: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: number;
  project: string;
  category: string;
  badge: string;
}

export interface AudioStem {
  name: 'dialogue' | 'foley' | 'sfx' | 'music';
  label: string;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  color: string;
}

export interface AudioDemoTrack {
  id: string;
  title: string;
  movie: string;
  category: string;
  duration: string;
  waveformPeaks: number[];
  type: 'action' | 'sci-fi' | 'horror' | 'foley' | 'drama';
  description: string;
}
