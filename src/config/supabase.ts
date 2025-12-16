import { createClient } from '@supabase/supabase-js'

// Variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar configuración
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL o Anon Key faltantes. Verifica tu archivo .env')
}

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
