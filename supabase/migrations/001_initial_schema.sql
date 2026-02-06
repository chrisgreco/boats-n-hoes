-- Boats N' Hoes - Initial Schema
-- A Prestige Worldwide Production

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_boat_owner BOOLEAN DEFAULT FALSE,
  looking_for TEXT CHECK (looking_for IN ('boat_party', 'dating', 'both')),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER CHECK (age >= 18 AND age <= 120),
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  instagram_handle TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOATS
-- ============================================
CREATE TABLE public.boats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('yacht', 'sailboat', 'speedboat', 'pontoon', 'catamaran', 'fishing', 'houseboat')),
  description TEXT NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL CHECK (hourly_rate > 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  length_ft INTEGER NOT NULL CHECK (length_ft > 0),
  year INTEGER CHECK (year >= 1900 AND year <= 2030),
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boat_id UUID NOT NULL REFERENCES public.boats(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- ============================================
-- MATCHES (Dating Feature)
-- ============================================
CREATE TABLE public.swipe_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right', 'super')),
  boat_id UUID REFERENCES public.boats(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  boat_id UUID REFERENCES public.boats(id) ON DELETE SET NULL,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a_id, user_b_id)
);

-- ============================================
-- CONVERSATIONS & MESSAGES
-- ============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_concierge BOOLEAN DEFAULT FALSE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.conversation_participants (
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boat_id UUID NOT NULL REFERENCES public.boats(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_boats_owner ON public.boats(owner_id);
CREATE INDEX idx_boats_type ON public.boats(type);
CREATE INDEX idx_boats_location ON public.boats(location);
CREATE INDEX idx_boats_available ON public.boats(is_available);
CREATE INDEX idx_boats_rate ON public.boats(hourly_rate);
CREATE INDEX idx_bookings_boat ON public.bookings(boat_id);
CREATE INDEX idx_bookings_renter ON public.bookings(renter_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_swipe_actions_swiper ON public.swipe_actions(swiper_id);
CREATE INDEX idx_swipe_actions_swiped ON public.swipe_actions(swiped_id);
CREATE INDEX idx_matches_users ON public.matches(user_a_id, user_b_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_reviews_boat ON public.reviews(boat_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipe_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Boats: anyone can read, owners can manage their own
CREATE POLICY "Boats are viewable by everyone" ON public.boats FOR SELECT USING (true);
CREATE POLICY "Owners can insert boats" ON public.boats FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own boats" ON public.boats FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete own boats" ON public.boats FOR DELETE USING (auth.uid() = owner_id);

-- Bookings: participants can view their own
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT
  USING (auth.uid() = renter_id OR auth.uid() IN (SELECT owner_id FROM public.boats WHERE id = boat_id));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Participants can update bookings" ON public.bookings FOR UPDATE
  USING (auth.uid() = renter_id OR auth.uid() IN (SELECT owner_id FROM public.boats WHERE id = boat_id));

-- Swipe actions: users can manage their own
CREATE POLICY "Users can view own swipes" ON public.swipe_actions FOR SELECT USING (auth.uid() = swiper_id);
CREATE POLICY "Users can create swipes" ON public.swipe_actions FOR INSERT WITH CHECK (auth.uid() = swiper_id);

-- Matches: matched users can view
CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Conversations: participants only
CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT
  USING (id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));

-- Conversation participants
CREATE POLICY "View own participations" ON public.conversation_participants FOR SELECT
  USING (user_id = auth.uid());

-- Messages: conversation participants only
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT
  USING (conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT
  WITH CHECK (conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));

-- Reviews: anyone can read, authors can manage
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/9.x/adventurer/svg?seed=' || NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-detect matches (when both users swipe right)
CREATE OR REPLACE FUNCTION public.check_for_match()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.direction = 'right' OR NEW.direction = 'super' THEN
    IF EXISTS (
      SELECT 1 FROM public.swipe_actions
      WHERE swiper_id = NEW.swiped_id
      AND swiped_id = NEW.swiper_id
      AND (direction = 'right' OR direction = 'super')
    ) THEN
      INSERT INTO public.matches (user_a_id, user_b_id, boat_id)
      VALUES (
        LEAST(NEW.swiper_id, NEW.swiped_id),
        GREATEST(NEW.swiper_id, NEW.swiped_id),
        NEW.boat_id
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_swipe_action
  AFTER INSERT ON public.swipe_actions
  FOR EACH ROW EXECUTE FUNCTION public.check_for_match();

-- Update boat rating when review is added
CREATE OR REPLACE FUNCTION public.update_boat_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.boats SET
    rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM public.reviews WHERE boat_id = NEW.boat_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE boat_id = NEW.boat_id)
  WHERE id = NEW.boat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_boat_rating();

-- Updated_at auto-update
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_boats_updated_at BEFORE UPDATE ON public.boats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
