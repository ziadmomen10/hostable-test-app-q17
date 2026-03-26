-- Create currencies table
CREATE TABLE public.currencies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code varchar(10) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  symbol varchar(10) NOT NULL,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

-- Create policies for currencies (similar to languages)
CREATE POLICY "Anyone can view currencies" 
ON public.currencies 
FOR SELECT 
USING (true);

CREATE POLICY "currencies_allow_admin" 
ON public.currencies 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_currencies_updated_at
BEFORE UPDATE ON public.currencies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default currencies
INSERT INTO public.currencies (code, name, symbol, is_default, is_active) VALUES
('USD', 'US Dollar', '$', true, true),
('EUR', 'Euro', '€', false, true),
('GBP', 'British Pound', '£', false, true),
('JPY', 'Japanese Yen', '¥', false, true),
('AUD', 'Australian Dollar', 'A$', false, true),
('CAD', 'Canadian Dollar', 'C$', false, true);