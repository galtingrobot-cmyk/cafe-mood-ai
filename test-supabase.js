import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zbumybgsprmpfdqmzbcf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidW15YmdzcHJtcGZkcW16YmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjU4ODcsImV4cCI6MjA2MTU0MTg4N30.u4fPq19k8j29-lEw7NqD8L8nNfQJj7Y8bW3f9D_Xy5Y';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('menu').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
