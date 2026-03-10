ALTER TABLE public.chatbot_conversations
ADD COLUMN total_tokens INTEGER DEFAULT 0,
ADD COLUMN total_cost NUMERIC(10,6) DEFAULT 0;