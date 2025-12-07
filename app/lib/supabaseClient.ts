import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * During build/prerender the env vars might not be available.
 * Only initialize the real client when both URL and ANON key exist.
 * Otherwise export a lightweight stub that throws on usage with a clear message.
 */
let supabase: SupabaseClient | any;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // Minimal stub to avoid runtime import errors during prerender/build.
  // Throws when any commonly used method is invoked, with clear guidance.
  const makeError = () =>
    new Error(
      'Supabase client not initialized. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set for build/runtime, or guard Supabase usage to client-side code.'
    );

  const thrower = () => {
    throw makeError();
  };

  const authStub = {
    getSession: () => Promise.reject(makeError()),
    getUser: () => Promise.reject(makeError()),
    signInWithPassword: () => Promise.reject(makeError()),
    signUp: () => Promise.reject(makeError()),
    verifyOtp: () => Promise.reject(makeError()),
    signOut: () => Promise.reject(makeError()),
  };

  const fromStub = () => ({
    select: () => Promise.reject(makeError()),
    insert: () => Promise.reject(makeError()),
    update: () => Promise.reject(makeError()),
    delete: () => Promise.reject(makeError()),
    // chainable calls may be used; return stub functions where reasonable
    then: () => Promise.reject(makeError()),
    order: () => fromStub(),
    eq: () => fromStub(),
  });

  const channelStub = () => ({
    on: () => ({ subscribe: () => Promise.reject(makeError()) }),
    subscribe: () => Promise.reject(makeError()),
  });

  supabase = {
    // minimal shape expected in app code
    auth: authStub,
    from: fromStub,
    channel: channelStub,
    // fallback for any other access
    __throw: thrower,
  } as any;
}

export { supabase };