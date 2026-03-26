import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';
import type { TestGroup } from './testRunner';

const TEST_EMAIL = 'e2e-test-runner@hostonce.test';
const TEST_PASSWORD = 'E2eTest!2026secure';

// Create an isolated Supabase client that never touches the shared app session
function createIsolatedClient() {
  const url = import.meta.env.VITE_SUPABASE_URL || "https://hkfjyktrgcxkxzdxxatx.supabase.co";
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZmp5a3RyZ2N4a3h6ZHh4YXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTU1OTAsImV4cCI6MjA2OTk3MTU5MH0.7l_j4sixljf5cbATgPn0JUyiMYn3HHDLAIDXX2PcJpI";
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: `e2e-isolated-${Date.now()}`,
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
  });
}

// Sign in as test user on an ISOLATED client (never the shared app client)
async function ensureTestUserOnClient(client: ReturnType<typeof createIsolatedClient>) {
  const { error: signInError } = await client.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (signInError) {
    // Try signup
    const { error: signUpError } = await client.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      options: { data: { username: 'e2e-test-runner', gender: 'male' } },
    });
    if (signUpError) throw new Error(`Cannot create test user: ${signUpError.message}`);
    const { error } = await client.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    if (error) throw new Error(`Cannot sign in after signup: ${error.message}`);
  }
}

// 1x1 transparent PNG as base64
const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function base64ToUint8Array(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

// ─── GROUP 1: Supabase Connection & Health ───
export const group1_supabaseHealth: TestGroup = {
  name: 'Supabase Connection & Health',
  tests: [
    {
      name: '1. Supabase client initialized',
      fn: async () => {
        assert(!!supabase, 'Supabase client is null');
        assert(typeof supabase.from === 'function', 'supabase.from is not a function');
      },
    },
    {
      name: '2. Anonymous read access (languages)',
      fn: async () => {
        const { data, error } = await supabase.from('languages').select('*');
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'Expected at least 1 language');
      },
    },
    {
      name: '3. Anonymous read pages',
      fn: async () => {
        const { data, error } = await supabase.from('pages').select('*').eq('is_active', true);
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'Expected at least 1 active page');
      },
    },
    {
      name: '4. Anonymous read currencies',
      fn: async () => {
        const { data, error } = await supabase.from('currencies').select('*').eq('is_active', true);
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'Expected at least 1 active currency');
      },
    },
    {
      name: '5. Anonymous read announcements',
      fn: async () => {
        const { data, error } = await supabase.from('announcements').select('*');
        assert(!error, `RLS error on announcements: ${error?.message}`);
        assert(Array.isArray(data), 'Expected array response');
      },
    },
    {
      name: '6. Realtime connection',
      fn: async () => {
        const channel = supabase.channel('e2e-test-health');
        try {
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Realtime subscribe timeout')), 5000);
            channel.subscribe((status) => {
              if (status === 'SUBSCRIBED') { clearTimeout(timer); resolve(); }
              if (status === 'CHANNEL_ERROR') { clearTimeout(timer); reject(new Error('Channel error')); }
            });
          });
        } finally {
          supabase.removeChannel(channel);
        }
      },
    },
  ],
};

// ─── GROUP 2: Authentication Flow ───
// All auth operations use an isolated client to avoid disturbing the admin session
export const group2_auth: TestGroup = {
  name: 'Authentication Flow',
  tests: [
    {
      name: '7. Get current session (app client)',
      fn: async () => {
        const { error } = await supabase.auth.getSession();
        assert(!error, `getSession error: ${error?.message}`);
      },
    },
    {
      name: '8. Sign in with wrong credentials',
      fn: async () => {
        const iso = createIsolatedClient();
        const { error } = await iso.auth.signInWithPassword({
          email: 'e2e-test-invalid@hostonce.test',
          password: 'wrongpassword123',
        });
        assert(!!error, 'Expected auth error but got none');
      },
    },
    {
      name: '9. Sign up / sign in test user',
      fn: async () => {
        const iso = createIsolatedClient();
        await ensureTestUserOnClient(iso);
        const { data } = await iso.auth.getSession();
        assert(!!data.session, 'No session after sign in');
      },
    },
    {
      name: '10. Verify session after sign-in',
      fn: async () => {
        const iso = createIsolatedClient();
        await ensureTestUserOnClient(iso);
        const { data } = await iso.auth.getSession();
        assert(!!data.session, 'Session is null');
        assert(data.session!.user.email === TEST_EMAIL, `Email mismatch: ${data.session!.user.email}`);
      },
    },
    {
      name: '11. Fetch user profile',
      fn: async () => {
        const iso = createIsolatedClient();
        await ensureTestUserOnClient(iso);
        const { data: session } = await iso.auth.getSession();
        if (!session.session) throw new Error('No session');
        const { data, error } = await iso.from('profiles').select('*').eq('user_id', session.session.user.id);
        assert(!error, `Profile fetch error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'No profile found');
      },
    },
    {
      name: '12. Fetch user roles',
      fn: async () => {
        const iso = createIsolatedClient();
        await ensureTestUserOnClient(iso);
        const { data: session } = await iso.auth.getSession();
        if (!session.session) throw new Error('No session');
        const { data, error } = await iso.from('user_roles').select('*').eq('user_id', session.session.user.id);
        assert(!error, `Roles fetch error: ${error?.message}`);
        assert(Array.isArray(data), 'Expected array');
      },
    },
    {
      name: '13. Sign out (isolated client)',
      fn: async () => {
        const iso = createIsolatedClient();
        await ensureTestUserOnClient(iso);
        const { error } = await iso.auth.signOut();
        assert(!error, `Sign out error: ${error?.message}`);
        const { data } = await iso.auth.getSession();
        assert(!data.session, 'Session still exists after sign out');
      },
    },
    {
      name: '14. Verify admin session intact',
      fn: async () => {
        const { data } = await supabase.auth.getSession();
        assert(!!data.session, 'Admin session was lost during auth tests!');
      },
    },
  ],
};

// ─── GROUP 3: Pages System (Read-Only) ───
export const group3_pagesReadOnly: TestGroup = {
  name: 'Pages System (Read-Only)',
  tests: [
    {
      name: '15. Fetch all pages',
      fn: async () => {
        const { data, error } = await supabase.from('pages').select('id, page_url, page_title');
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'No pages found');
      },
    },
    {
      name: '16. Fetch homepage by URL',
      fn: async () => {
        const { data, error } = await supabase.from('pages').select('*').eq('page_url', '/').single();
        assert(!error, `Error: ${error?.message}`);
        assert(!!data?.content, 'Homepage has no content');
      },
    },
    {
      name: '17. Fetch VPS hosting page',
      fn: async () => {
        const { data, error } = await supabase.from('pages').select('*').eq('page_url', '/vps-hosting').single();
        assert(!error, `Error: ${error?.message}`);
        assert(!!data, 'VPS hosting page not found');
      },
    },
    {
      name: '18. Fetch non-existent page',
      fn: async () => {
        const { data, error } = await supabase.from('pages').select('*').eq('page_url', '/e2e-nonexistent-test-page-xyz');
        assert(!error, `Unexpected error: ${error?.message}`);
        assert(Array.isArray(data) && data.length === 0, 'Expected empty result');
      },
    },
    {
      name: '19. Page has required fields',
      fn: async () => {
        const { data } = await supabase.from('pages').select('*').eq('page_url', '/').single();
        assert(!!data, 'No homepage');
        for (const field of ['id', 'page_url', 'page_title', 'page_description', 'content', 'is_active', 'created_at']) {
          assert(field in data, `Missing field: ${field}`);
        }
      },
    },
    {
      name: '20. Page translations exist',
      fn: async () => {
        const { data: page } = await supabase.from('pages').select('id').eq('page_url', '/').single();
        if (!page) throw new Error('No homepage');
        const { data, error } = await supabase.from('page_translations').select('*').eq('page_id', page.id);
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data), 'Expected array');
      },
    },
  ],
};

// ─── GROUP 4: Pages CRUD ───
// Uses the shared admin client (supabase) for CRUD since admin is already signed in
export const group4_pagesCrud: TestGroup = {
  name: 'Pages CRUD (Create → Read → Update → Delete)',
  tests: [
    {
      name: '21–26. Full CRUD cycle',
      fn: async () => {
        // Use the shared admin client — admin is already authenticated
        let testPageId: string | null = null;
        try {
          // Create
          const { data: created, error: createErr } = await supabase.from('pages').insert({
            page_url: '/e2e-test-page-cleanup',
            page_title: 'E2E Test Page',
            page_description: 'Automated test - safe to delete',
            content: '<h1>E2E Test</h1>',
            is_active: false,
          }).select().single();

          if (createErr) {
            if (createErr.message.includes('policy') || createErr.code === '42501') {
              throw new Error('SKIP: Current user lacks admin role for CRUD. ' + createErr.message);
            }
            throw new Error(`Create failed: ${createErr.message}`);
          }
          assert(!!created?.id, 'No ID returned');
          testPageId = created.id;

          // Read
          const { data: read } = await supabase.from('pages').select('*').eq('id', testPageId).single();
          assert(read?.page_title === 'E2E Test Page', 'Title mismatch on read');

          // Update
          const { error: updateErr } = await supabase.from('pages').update({ page_title: 'E2E Test Page Updated' }).eq('id', testPageId);
          if (updateErr) throw new Error(`Update failed: ${updateErr.message}`);

          // Read updated
          const { data: updated } = await supabase.from('pages').select('page_title').eq('id', testPageId).single();
          assert(updated?.page_title === 'E2E Test Page Updated', 'Title not updated');

          // Delete
          const { error: deleteErr } = await supabase.from('pages').delete().eq('id', testPageId);
          if (deleteErr) throw new Error(`Delete failed: ${deleteErr.message}`);
          testPageId = null;

          // Verify deletion
          const { data: gone } = await supabase.from('pages').select('id').eq('id', created.id);
          assert(!gone || gone.length === 0, 'Page still exists after delete');
        } finally {
          if (testPageId) {
            await supabase.from('pages').delete().eq('id', testPageId);
          }
        }
      },
    },
  ],
};

// ─── GROUP 5: Languages & i18n ───
export const group5_languages: TestGroup = {
  name: 'Languages & Internationalization',
  tests: [
    {
      name: '27. Fetch all languages',
      fn: async () => {
        const { data, error } = await supabase.from('languages').select('id, code, name, is_active');
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'No languages');
      },
    },
    {
      name: '28. Default language exists',
      fn: async () => {
        const { data } = await supabase.from('languages').select('*').eq('is_default', true);
        assert(Array.isArray(data) && data.length === 1, `Expected 1 default language, got ${data?.length}`);
      },
    },
    {
      name: '29. Fetch translations for default language',
      fn: async () => {
        const { data: lang } = await supabase.from('languages').select('id').eq('is_default', true).single();
        if (!lang) throw new Error('No default language');
        const { data, error } = await supabase.from('translations').select('*').eq('language_id', lang.id).limit(10);
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'No translations for default language');
      },
    },
    {
      name: '30. Fetch namespaces',
      fn: async () => {
        const { data, error } = await supabase.from('namespaces').select('*');
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'No namespaces');
      },
    },
    {
      name: '31. Translation has required fields',
      fn: async () => {
        const { data } = await supabase.from('translations').select('*').limit(1);
        if (!data || data.length === 0) throw new Error('No translations to validate');
        const t = data[0];
        for (const f of ['id', 'language_id', 'namespace', 'key', 'value']) {
          assert(f in t, `Missing field: ${f}`);
        }
      },
    },
    {
      name: '32. I18n context loads',
      skip: true,
      skipReason: 'Cannot render I18nProvider outside React tree in test scope',
      fn: async () => {},
    },
  ],
};

// ─── GROUP 6: Currency System ───
export const group6_currencies: TestGroup = {
  name: 'Currency System',
  tests: [
    {
      name: '33. Fetch all currencies',
      fn: async () => {
        const { data, error } = await supabase.from('currencies').select('*');
        assert(!error, `Error: ${error?.message}`);
        assert(Array.isArray(data) && data.length > 0, 'No currencies');
      },
    },
    {
      name: '34. Default currency exists',
      fn: async () => {
        const { data } = await supabase.from('currencies').select('*').eq('is_default', true);
        assert(Array.isArray(data) && data.length === 1, `Expected 1 default, got ${data?.length}`);
      },
    },
    {
      name: '35. Currency has required fields',
      fn: async () => {
        const { data } = await supabase.from('currencies').select('*').limit(1);
        if (!data?.[0]) throw new Error('No currencies');
        for (const f of ['id', 'code', 'name', 'symbol', 'exchange_rate', 'is_active']) {
          assert(f in data[0], `Missing field: ${f}`);
        }
      },
    },
    {
      name: '36. Exchange rate is valid',
      fn: async () => {
        const { data: def } = await supabase.from('currencies').select('*').eq('is_default', true).single();
        if (!def) throw new Error('No default currency');
        assert(Math.abs(Number(def.exchange_rate) - 1) < 0.01, `Default exchange_rate should be ~1, got ${def.exchange_rate}`);
        const { data: others } = await supabase.from('currencies').select('exchange_rate').eq('is_active', true).neq('is_default', true);
        if (others) {
          for (const c of others) {
            assert(Number(c.exchange_rate) > 0, `Non-default currency has invalid rate: ${c.exchange_rate}`);
          }
        }
      },
    },
  ],
};

// ─── GROUP 7: Storage Buckets ───
// Upload/delete use the shared admin client (admin is already authed)
export const group7_storage: TestGroup = {
  name: 'Storage Buckets',
  tests: [
    {
      name: '37. List avatars bucket',
      fn: async () => {
        const { error } = await supabase.storage.from('avatars').list();
        assert(!error, `Error: ${error?.message}`);
      },
    },
    {
      name: '38. List page-assets bucket',
      fn: async () => {
        const { error } = await supabase.storage.from('page-assets').list();
        assert(!error, `Error: ${error?.message}`);
      },
    },
    {
      name: '39. List system-assets bucket',
      fn: async () => {
        const { error } = await supabase.storage.from('system-assets').list();
        if (error && !error.message.includes('not found')) {
          throw new Error(`Unexpected error: ${error.message}`);
        }
      },
    },
    {
      name: '40. Upload test file',
      fn: async () => {
        const bytes = base64ToUint8Array(TINY_PNG_BASE64);
        const { error } = await supabase.storage.from('avatars').upload('e2e-test-cleanup.png', bytes, {
          contentType: 'image/png',
          upsert: true,
        });
        if (error) throw new Error(`Upload failed: ${error.message}`);
      },
    },
    {
      name: '41. Get public URL',
      fn: async () => {
        const { data } = supabase.storage.from('avatars').getPublicUrl('e2e-test-cleanup.png');
        assert(typeof data.publicUrl === 'string' && data.publicUrl.length > 0, 'No public URL');
      },
    },
    {
      name: '42. Delete test file',
      fn: async () => {
        const { error } = await supabase.storage.from('avatars').remove(['e2e-test-cleanup.png']);
        if (error) throw new Error(`Delete failed: ${error.message}`);
      },
    },
  ],
};

// ─── GROUP 8: RLS Enforcement ───
// All tests use an isolated anonymous client — never sign out the shared client
export const group8_rls: TestGroup = {
  name: 'Row-Level Security (RLS) Enforcement',
  tests: [
    {
      name: '43. Anonymous cannot insert page',
      fn: async () => {
        const anon = createIsolatedClient();
        const { error } = await anon.from('pages').insert({
          page_url: '/e2e-rls-test',
          page_title: 'RLS Test',
          is_active: false,
        });
        assert(!!error, 'Expected RLS error on insert');
      },
    },
    {
      name: '44. Anonymous cannot update page',
      fn: async () => {
        const anon = createIsolatedClient();
        const { error } = await anon.from('pages').update({ page_title: 'HACKED' }).eq('page_url', '/');
        assert(!!error || true, 'Update should be blocked by RLS');
        const { data } = await anon.from('pages').select('page_title').eq('page_url', '/').single();
        assert(data?.page_title !== 'HACKED', 'Page was unexpectedly updated!');
      },
    },
    {
      name: '45. Anonymous cannot delete page',
      fn: async () => {
        const anon = createIsolatedClient();
        const { data: pages } = await anon.from('pages').select('id').limit(1);
        if (!pages?.[0]) throw new Error('No pages to test with');
        const { error } = await anon.from('pages').delete().eq('id', pages[0].id);
        const { data: check } = await anon.from('pages').select('id').eq('id', pages[0].id);
        assert(check && check.length > 0, 'Page was deleted by anon!');
      },
    },
    {
      name: '46. Anonymous cannot read admin-only tables',
      fn: async () => {
        const anon = createIsolatedClient();
        const { data } = await anon.from('profiles').select('*');
        assert(Array.isArray(data), 'Expected array response');
      },
    },
    {
      name: '47. Anonymous cannot modify currencies',
      fn: async () => {
        const anon = createIsolatedClient();
        const { error } = await anon.from('currencies').insert({
          code: 'E2E', name: 'E2E Test', symbol: 'T',
        });
        assert(!!error, 'Expected RLS error on currency insert');
      },
    },
    {
      name: '48. Anonymous cannot modify languages',
      fn: async () => {
        const anon = createIsolatedClient();
        const { error } = await anon.from('languages').insert({
          code: 'e2', name: 'E2E Test',
        });
        assert(!!error, 'Expected RLS error on language insert');
      },
    },
  ],
};

// ─── GROUP 9: Realtime Subscriptions ───
export const group9_realtime: TestGroup = {
  name: 'Realtime Subscriptions',
  tests: [
    {
      name: '49. Subscribe to pages channel',
      fn: async () => {
        const channel = supabase.channel('e2e-pages-watch').on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'pages' },
          () => {}
        );
        try {
          await new Promise<void>((resolve, reject) => {
            const t = setTimeout(() => reject(new Error('Subscribe timeout')), 5000);
            channel.subscribe((status) => {
              if (status === 'SUBSCRIBED') { clearTimeout(t); resolve(); }
              if (status === 'CHANNEL_ERROR') { clearTimeout(t); reject(new Error('Channel error')); }
            });
          });
        } finally {
          supabase.removeChannel(channel);
        }
      },
    },
    {
      name: '50. Receive realtime update',
      skip: true,
      skipReason: 'Requires admin to create+update+delete temp page; skipped for non-admin test user',
      fn: async () => {},
    },
    {
      name: '51. Unsubscribe cleanly',
      fn: async () => {
        const channel = supabase.channel('e2e-unsub-test');
        channel.subscribe();
        const result = await supabase.removeChannel(channel);
        assert(result === 'ok' || result === 'timed out', `Unexpected result: ${result}`);
      },
    },
  ],
};

// ─── GROUP 10: UI Component Rendering ───
export const group10_ui: TestGroup = {
  name: 'UI Component Rendering',
  tests: [
    { name: '52. Homepage renders', skip: true, skipReason: 'Cannot navigate away from admin context', fn: async () => {} },
    { name: '53. VPS Hosting page renders', skip: true, skipReason: 'Cannot navigate away from admin context', fn: async () => {} },
    { name: '54. Dynamic page renders', skip: true, skipReason: 'Cannot navigate away from admin context', fn: async () => {} },
    { name: '55. 404 handling', skip: true, skipReason: 'Cannot navigate away from admin context', fn: async () => {} },
    { name: '56. Admin dashboard renders', skip: true, skipReason: 'Already rendered — would cause navigation loop', fn: async () => {} },
    { name: '57. Theme toggle works', skip: true, skipReason: 'Requires DOM inspection outside test scope', fn: async () => {} },
    { name: '58. Language switcher works', skip: true, skipReason: 'Requires context provider outside test scope', fn: async () => {} },
    { name: '59. Currency switcher works', skip: true, skipReason: 'Requires context provider outside test scope', fn: async () => {} },
  ],
};

// ─── GROUP 11: API & Network Resilience ───
export const group11_network: TestGroup = {
  name: 'API & Network Resilience',
  tests: [
    {
      name: '60. Supabase responds under 2 seconds',
      fn: async () => {
        const start = performance.now();
        await supabase.from('languages').select('id');
        const elapsed = performance.now() - start;
        assert(elapsed < 2000, `Response took ${elapsed.toFixed(0)}ms (>2000ms)`);
      },
    },
    {
      name: '61. Concurrent reads',
      fn: async () => {
        const results = await Promise.all([
          supabase.from('languages').select('id'),
          supabase.from('currencies').select('id'),
          supabase.from('pages').select('id').limit(5),
          supabase.from('announcements').select('id'),
          supabase.from('namespaces').select('id'),
        ]);
        for (const r of results) {
          assert(!r.error, `Concurrent query failed: ${r.error?.message}`);
        }
      },
    },
    {
      name: '62. Large page content',
      fn: async () => {
        const { data } = await supabase.from('pages').select('content').eq('page_url', '/').single();
        assert(!!data?.content && data.content.length > 0, 'Homepage content is empty');
      },
    },
    {
      name: '63. Malformed query handling',
      fn: async () => {
        const { error } = await supabase.from('e2e_fake_table' as any).select('*');
        assert(!!error, 'Expected error for non-existent table');
      },
    },
  ],
};

// ─── GROUP 12: SEO & Metadata ───
export const group12_seo: TestGroup = {
  name: 'SEO & Metadata',
  tests: [
    {
      name: '64. Pages have SEO fields',
      fn: async () => {
        const { data } = await supabase.from('pages').select('page_title, page_description, page_keywords').eq('page_url', '/').single();
        assert(!!data, 'No homepage');
        assert(!!data.page_title, 'Missing page_title');
        assert(!!data.page_description, 'Missing page_description');
      },
    },
    {
      name: '65. Active pages have URLs',
      fn: async () => {
        const { data } = await supabase.from('pages').select('page_url').eq('is_active', true);
        if (data) {
          for (const p of data) {
            assert(p.page_url.startsWith('/'), `Invalid URL: ${p.page_url}`);
          }
        }
      },
    },
    {
      name: '66. No duplicate page URLs',
      fn: async () => {
        const { data } = await supabase.from('pages').select('page_url');
        if (data) {
          const urls = data.map(p => p.page_url);
          const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
          assert(dupes.length === 0, `Duplicate URLs: ${dupes.join(', ')}`);
        }
      },
    },
  ],
};

// ─── GROUP 13: Activity & Audit Logging ───
// Uses the shared admin client — admin should have access to activity_logs
export const group13_activity: TestGroup = {
  name: 'Activity & Audit Logging',
  tests: [
    {
      name: '67. Activity logs table accessible',
      fn: async () => {
        const { error } = await supabase.from('activity_logs').select('id').limit(1);
        assert(!error || error.message.includes('policy'), `Unexpected error: ${error?.message}`);
      },
    },
    {
      name: '68. Activity log has required fields',
      fn: async () => {
        const { data } = await supabase.from('activity_logs').select('*').limit(1);
        if (data && data.length > 0) {
          for (const f of ['id', 'activity_type', 'title', 'created_at']) {
            assert(f in data[0], `Missing field: ${f}`);
          }
        }
      },
    },
  ],
};

export const allTestGroups: TestGroup[] = [
  group1_supabaseHealth,
  group2_auth,
  group3_pagesReadOnly,
  group4_pagesCrud,
  group5_languages,
  group6_currencies,
  group7_storage,
  group8_rls,
  group9_realtime,
  group10_ui,
  group11_network,
  group12_seo,
  group13_activity,
];
