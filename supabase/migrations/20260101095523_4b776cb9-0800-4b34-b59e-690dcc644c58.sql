-- Create packages table for hosting package management
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_key text NOT NULL,
  description_key text,
  monthly_price decimal(10,2) NOT NULL DEFAULT 0,
  monthly_discounted_price decimal(10,2),
  yearly_price decimal(10,2) NOT NULL DEFAULT 0,
  yearly_discounted_price decimal(10,2),
  features jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Public can view active packages
CREATE POLICY "Public can view active packages"
ON public.packages
FOR SELECT
USING (is_active = true);

-- Admins have full access
CREATE POLICY "Admins can manage packages"
ON public.packages
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for activity logging
CREATE TRIGGER log_package_changes
AFTER INSERT OR UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.log_package_activity();