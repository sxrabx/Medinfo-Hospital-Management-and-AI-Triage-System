import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yqjxepuoratdxlzzpyys.supabase.co'
const supabaseKey = 'sb_publishable_Vm-JJMBO0ws1Oroq1bGpXw_Cr6fF45v'


export const supabase = createClient(supabaseUrl, supabaseKey)