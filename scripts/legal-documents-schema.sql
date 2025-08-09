-- Create legal_documents table for storing user-generated legal documents
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'pozew', 'umowa', 'odwolanie', etc.
    recipient_name VARCHAR(255),
    recipient_address TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_legal_documents_user_id ON legal_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_documents_type ON legal_documents(type);
CREATE INDEX IF NOT EXISTS idx_legal_documents_status ON legal_documents(status);

-- Enable RLS (Row Level Security)
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own documents
CREATE POLICY "Users can only see their own documents" ON legal_documents
    FOR ALL USING (auth.uid() = user_id);
