// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dqkoklfdlqabquqqofsg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa29rbGZkbHFhYnF1cXFvZnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NTI3ODgsImV4cCI6MjA1MDMyODc4OH0.ZtSKLWUvh-qb9vE24rcxq0H8dU9LeuwmxGHZtphDxyA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);