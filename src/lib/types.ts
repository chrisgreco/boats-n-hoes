export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  is_boat_owner: boolean;
  looking_for: 'boat_party' | 'dating' | 'both' | null;
  gender: 'male' | 'female' | 'other' | null;
  age: number | null;
  location: string | null;
  instagram_handle: string | null;
  created_at: string;
}

export interface Boat {
  id: string;
  owner_id: string;
  owner?: User;
  name: string;
  type: 'yacht' | 'sailboat' | 'speedboat' | 'pontoon' | 'catamaran' | 'fishing' | 'houseboat';
  description: string;
  hourly_rate: number;
  capacity: number;
  length_ft: number;
  year: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  amenities: string[];
  is_available: boolean;
  rating: number;
  review_count: number;
  created_at: string;
}

export interface Booking {
  id: string;
  boat_id: string;
  boat?: Boat;
  renter_id: string;
  renter?: User;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  party_size: number;
  special_requests: string | null;
  created_at: string;
}

export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  user_a?: User;
  user_b?: User;
  status: 'pending' | 'matched' | 'rejected';
  boat_id: string | null;
  boat?: Boat;
  matched_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: User;
  content: string;
  is_ai: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_ids: string[];
  participants?: User[];
  last_message?: Message;
  booking_id: string | null;
  match_id: string | null;
  is_concierge: boolean;
  created_at: string;
  updated_at: string;
}

export interface SwipeProfile {
  user: User;
  boat?: Boat;
  distance_miles: number;
  mutual_interests: string[];
}

// ─── BOATS N' BROS (Bumble BFF-style) ───────────────────

export interface BroProfile {
  user: User;
  vibe: 'chill' | 'party' | 'adventure' | 'fishing' | 'watersports';
  boat_preferences: string[];
  availability: string;
  crew_size_preferred: number;
  fun_fact: string;
  distance_miles: number;
  mutual_interests: string[];
}

export interface Crew {
  id: string;
  name: string;
  captain_id: string;
  captain?: User;
  members: User[];
  max_size: number;
  vibe: 'chill' | 'party' | 'adventure' | 'fishing' | 'watersports';
  description: string;
  next_trip?: string;
  avatar_url: string;
  created_at: string;
}

// ─── AGGREGATED LISTINGS (Boatsetter / GetMyBoat / etc.) ─

export type AggregatorSource = 'boatsetter' | 'getmyboat' | 'click_and_boat' | 'sailo';

export interface AggregatedListing {
  id: string;
  source: AggregatorSource;
  external_url: string;
  name: string;
  type: 'yacht' | 'sailboat' | 'speedboat' | 'pontoon' | 'catamaran' | 'fishing' | 'houseboat' | 'jet_ski' | 'center_console';
  description: string;
  price_per_hour: number | null;
  price_per_day: number | null;
  currency: string;
  capacity: number;
  length_ft: number;
  year: number | null;
  location: string;
  city: string;
  state: string;
  images: string[];
  amenities: string[];
  captain_included: boolean;
  instant_book: boolean;
  rating: number;
  review_count: number;
  owner_name: string;
  owner_avatar: string | null;
  owner_response_rate: number;
  owner_response_time: string;
  cancellation_policy: 'flexible' | 'moderate' | 'strict';
  fetched_at: string;
}
