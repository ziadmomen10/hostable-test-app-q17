-- Create table for banned IP addresses
CREATE TABLE public.banned_ips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  banned_by_user_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.banned_ips ENABLE ROW LEVEL SECURITY;

-- Create policy for admins only
CREATE POLICY "Only admins can manage banned IPs" 
ON public.banned_ips 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banned_ips_updated_at
BEFORE UPDATE ON public.banned_ips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster IP lookups
CREATE INDEX idx_banned_ips_ip_address ON public.banned_ips(ip_address);