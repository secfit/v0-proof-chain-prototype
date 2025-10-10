-- Supabase Database Schema for ProofChain Audit System
-- Run these SQL commands in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS audit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ipfs_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS developers ENABLE ROW LEVEL SECURITY;

-- 1. Audit Requests Table
CREATE TABLE IF NOT EXISTS audit_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_name TEXT NOT NULL,
    project_description TEXT,
    github_url TEXT,
    repository_hash TEXT,
    complexity TEXT CHECK (complexity IN ('Low', 'Medium', 'High', 'Critical')),
    estimated_duration INTEGER,
    proposed_price DECIMAL(10,2),
    auditor_count INTEGER,
    developer_wallet TEXT NOT NULL,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'In Progress', 'Completed', 'Cancelled')),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Smart Contracts Table
CREATE TABLE IF NOT EXISTS smart_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    audit_request_id UUID REFERENCES audit_requests(id) ON DELETE CASCADE,
    contract_address TEXT NOT NULL,
    contract_type TEXT CHECK (contract_type IN ('ERC20', 'ERC721', 'ERC1155')),
    contract_name TEXT,
    contract_symbol TEXT,
    total_supply BIGINT,
    decimals INTEGER,
    deployment_hash TEXT,
    explorer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. NFTs Table
CREATE TABLE IF NOT EXISTS nfts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    audit_request_id UUID REFERENCES audit_requests(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES smart_contracts(id) ON DELETE CASCADE,
    token_id TEXT NOT NULL,
    token_name TEXT,
    token_description TEXT,
    metadata_uri TEXT,
    owner_wallet TEXT NOT NULL,
    mint_transaction_hash TEXT,
    explorer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. IPFS Data Table
CREATE TABLE IF NOT EXISTS ipfs_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    audit_request_id UUID REFERENCES audit_requests(id) ON DELETE CASCADE,
    nft_id UUID REFERENCES nfts(id) ON DELETE CASCADE,
    ipfs_hash TEXT NOT NULL,
    ipfs_uri TEXT,
    content_type TEXT CHECK (content_type IN ('Metadata', 'Image', 'Document', 'Other')),
    file_size BIGINT,
    related_contract TEXT,
    related_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Developers Table
CREATE TABLE IF NOT EXISTS developers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    total_projects INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    reputation_score INTEGER DEFAULT 100 CHECK (reputation_score >= 0 AND reputation_score <= 100),
    first_project_date TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Banned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_requests_developer_wallet ON audit_requests(developer_wallet);
CREATE INDEX IF NOT EXISTS idx_audit_requests_status ON audit_requests(status);
CREATE INDEX IF NOT EXISTS idx_audit_requests_created_at ON audit_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_smart_contracts_audit_request_id ON smart_contracts(audit_request_id);
CREATE INDEX IF NOT EXISTS idx_nfts_audit_request_id ON nfts(audit_request_id);
CREATE INDEX IF NOT EXISTS idx_nfts_contract_id ON nfts(contract_id);
CREATE INDEX IF NOT EXISTS idx_ipfs_data_audit_request_id ON ipfs_data(audit_request_id);
CREATE INDEX IF NOT EXISTS idx_ipfs_data_nft_id ON ipfs_data(nft_id);
CREATE INDEX IF NOT EXISTS idx_developers_wallet_address ON developers(wallet_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_audit_requests_updated_at BEFORE UPDATE ON audit_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on audit_requests" ON audit_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations on smart_contracts" ON smart_contracts FOR ALL USING (true);
CREATE POLICY "Allow all operations on nfts" ON nfts FOR ALL USING (true);
CREATE POLICY "Allow all operations on ipfs_data" ON ipfs_data FOR ALL USING (true);
CREATE POLICY "Allow all operations on developers" ON developers FOR ALL USING (true);

-- Insert sample data (optional)
INSERT INTO developers (wallet_address, total_projects, total_spent, reputation_score, first_project_date, status) 
VALUES ('0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433', 0, 0, 100, NOW(), 'Active')
ON CONFLICT (wallet_address) DO NOTHING;
