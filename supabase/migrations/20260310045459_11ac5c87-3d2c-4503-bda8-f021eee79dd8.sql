CREATE TABLE public.chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  language TEXT DEFAULT 'ko',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  message_count INTEGER DEFAULT 0,
  first_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and updates (chatbot is public)
CREATE POLICY "Allow public insert chatbot_conversations"
  ON public.chatbot_conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update chatbot_conversations"
  ON public.chatbot_conversations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated admins can read
CREATE POLICY "Admins can read chatbot_conversations"
  ON public.chatbot_conversations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE INDEX idx_chatbot_conversations_created_at ON public.chatbot_conversations (created_at DESC);