-- Clear existing languages and add all languages from the homepage
DELETE FROM public.translations;
DELETE FROM public.languages;

-- Insert all languages from the homepage header
INSERT INTO public.languages (code, name, native_name, is_default, is_active) VALUES
('en', 'English (US)', 'English', true, true),
('ar', 'Arabic', 'العربية', false, true),
('ru', 'Russian', 'Русский', false, true),
('nl', 'Dutch', 'Nederlands', false, true),
('fr', 'French', 'Français', false, true),
('de', 'German', 'Deutsch', false, true),
('it', 'Italian', 'Italiano', false, true),
('pt', 'Portuguese', 'Português', false, true),
('es', 'Spanish', 'Español', false, true),
('tr', 'Turkish', 'Türkçe', false, true),
('ka', 'Georgian', 'ქართული', false, true),
('hi', 'Hindi', 'हिंदी', false, true),
('id', 'Indonesian', 'Bahasa', false, true),
('pl', 'Polish', 'Polski', false, true),
('vi', 'Vietnamese', 'Tiếng Việt', false, true),
('th', 'Thai', 'ไทย', false, true),
('ko', 'Korean', '한국', false, true),
('ro', 'Romanian', 'Română', false, true),
('fa', 'Persian', 'فارسی', false, true),
('hu', 'Hungarian', 'Magyar', false, true),
('tl', 'Filipino', 'Filipino', false, true),
('cs', 'Czech', 'Čeština', false, true),
('da', 'Danish', 'Dansk', false, true),
('no', 'Norwegian', 'Norsk', false, true),
('uk', 'Ukrainian', 'Українська', false, true),
('zh', 'Chinese', '中文', false, true);