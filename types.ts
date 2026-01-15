export type ItineraryMode = 'A' | 'B' | 'C'; // A: Domestic, B: SG/MY, C: English

export type SegmentType = 'transfer' | 'sight' | 'experience' | 'free' | 'tip' | 'branch';

export interface Segment {
  type: SegmentType;
  description: string; // The content (e.g., "Airport Pick-up" or "Mount Fuji")
  detail?: string; // Optional extra detail
}

export interface DaySchedule {
  day_no: number;
  title: string;
  highlights: string[];
  segments: Segment[];
  stay: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  tips: string[];
}

export interface ItineraryData {
  template_code: string;
  title: string;
  mode: ItineraryMode;
  route_overview: string;
  tags: string[];
  duration_days: number;
  duration_nights: number;
  defaults: {
    transport: string;
    target_audience: string;
  };
  itinerary: DaySchedule[];
  includes: string[];
  excludes: string[];
  notes: string[];
  signature: string;
}

// User Input State
export interface TripRequest {
  destination: string;
  days: number;
  // Pax Split
  adults: number;
  children: number;
  // Price Split
  adultPrice: number;
  childPrice: number;
  
  currency: string;
  mode: ItineraryMode;
  depositType: 'percent' | 'fixed';
  depositValue: number;
  
  contactName: string;
  contactInfo: string;
  
  // Global Visualization Settings
  includeMeals: boolean; // if false, override output to "Self-arranged"
  guideMode: 'Driver-Guide' | 'Chinese-Guide' | 'English-Guide';
  
  requirements: string; // Free text for specifics
}