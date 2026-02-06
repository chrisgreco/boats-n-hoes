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
