// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://axdkgkyfxhuinfoglggv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZGtna3lmeGh1aW5mb2dsZ2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTc4ODcsImV4cCI6MjA2NDM3Mzg4N30.zNYZj1IIJ6qgq4bOhHPMhod0OHutjYcSTDfLY_IVVa4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
