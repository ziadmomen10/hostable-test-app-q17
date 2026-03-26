-- Insert some common default translations for English
INSERT INTO public.languages (code, name, native_name, is_default, is_active, direction) 
VALUES ('en', 'English', 'English', true, true, 'ltr')
ON CONFLICT (code) DO UPDATE SET
  is_default = true,
  is_active = true,
  direction = 'ltr';

-- Get English language ID
DO $$
DECLARE
    english_lang_id UUID;
BEGIN
    SELECT id INTO english_lang_id FROM public.languages WHERE code = 'en';
    
    -- Insert common translations
    INSERT INTO public.translations (language_id, namespace, key, value) VALUES
    (english_lang_id, 'common', 'save', 'Save'),
    (english_lang_id, 'common', 'cancel', 'Cancel'),
    (english_lang_id, 'common', 'delete', 'Delete'),
    (english_lang_id, 'common', 'edit', 'Edit'),
    (english_lang_id, 'common', 'add', 'Add'),
    (english_lang_id, 'common', 'loading', 'Loading'),
    (english_lang_id, 'common', 'error', 'Error'),
    (english_lang_id, 'common', 'success', 'Success'),
    (english_lang_id, 'common', 'yes', 'Yes'),
    (english_lang_id, 'common', 'no', 'No'),
    (english_lang_id, 'common', 'ok', 'OK'),
    (english_lang_id, 'common', 'close', 'Close'),
    (english_lang_id, 'common', 'search', 'Search'),
    (english_lang_id, 'common', 'filter', 'Filter'),
    (english_lang_id, 'common', 'clear', 'Clear'),
    (english_lang_id, 'common', 'reset', 'Reset'),
    (english_lang_id, 'common', 'submit', 'Submit'),
    (english_lang_id, 'common', 'next', 'Next'),
    (english_lang_id, 'common', 'previous', 'Previous'),
    (english_lang_id, 'common', 'back', 'Back'),
    (english_lang_id, 'common', 'continue', 'Continue'),
    (english_lang_id, 'common', 'confirm', 'Confirm'),
    
    -- Authentication translations
    (english_lang_id, 'auth', 'login', 'Login'),
    (english_lang_id, 'auth', 'logout', 'Logout'),
    (english_lang_id, 'auth', 'register', 'Register'),
    (english_lang_id, 'auth', 'password', 'Password'),
    (english_lang_id, 'auth', 'email', 'Email'),
    (english_lang_id, 'auth', 'username', 'Username'),
    (english_lang_id, 'auth', 'forgot_password', 'Forgot Password'),
    (english_lang_id, 'auth', 'reset_password', 'Reset Password'),
    (english_lang_id, 'auth', 'change_password', 'Change Password'),
    
    -- UI translations
    (english_lang_id, 'ui', 'welcome', 'Welcome'),
    (english_lang_id, 'ui', 'dashboard', 'Dashboard'),
    (english_lang_id, 'ui', 'settings', 'Settings'),
    (english_lang_id, 'ui', 'profile', 'Profile'),
    (english_lang_id, 'ui', 'notifications', 'Notifications'),
    (english_lang_id, 'ui', 'preferences', 'Preferences'),
    (english_lang_id, 'ui', 'language', 'Language'),
    (english_lang_id, 'ui', 'theme', 'Theme'),
    (english_lang_id, 'ui', 'help', 'Help'),
    (english_lang_id, 'ui', 'support', 'Support'),
    
    -- Error messages
    (english_lang_id, 'errors', 'required', 'This field is required'),
    (english_lang_id, 'errors', 'invalid', 'Invalid value'),
    (english_lang_id, 'errors', 'network', 'Network error occurred'),
    (english_lang_id, 'errors', 'server', 'Server error occurred'),
    (english_lang_id, 'errors', 'unauthorized', 'Unauthorized access'),
    (english_lang_id, 'errors', 'forbidden', 'Access forbidden'),
    (english_lang_id, 'errors', 'not_found', 'Not found'),
    (english_lang_id, 'errors', 'validation', 'Validation error')
    
    ON CONFLICT (language_id, namespace, key) DO NOTHING;
END $$;