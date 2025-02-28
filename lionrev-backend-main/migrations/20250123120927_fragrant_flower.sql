
CREATE TABLE IF NOT EXISTS facebook_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  full_name TEXT,
  phone_number TEXT,
  ad_id TEXT,
  ad_name TEXT,
  adset_id TEXT,
  adset_name TEXT,
  campaign_id TEXT,
  campaign_name TEXT,
  form_id TEXT,
  form_name TEXT,
  lead_id TEXT,
  platform TEXT,
  zip_code TEXT,
  page_id TEXT,
  page_name TEXT,
  raw_full_name TEXT,
  raw_phone_number TEXT,
  raw_email TEXT,
  raw_services_interested TEXT,
  raw_zip_code TEXT,
  services_interested TEXT,
  vehicle TEXT,
  create_at TIMESTAMPTZ DEFAULT NOW()
);


-- Enable Row Level Security
ALTER TABLE facebook_leads ENABLE ROW LEVEL SECURITY;
