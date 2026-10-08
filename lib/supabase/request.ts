import { createClient as createSupabaseClient, type User } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function getRequestSupabase(request: Request): Promise<{
  supabase: ReturnType<typeof createSupabaseClient>
  user: User | null
}> {
  const authHeader = request.headers.get("authorization")

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)
    return { supabase, user: error ? null : user }
  }

  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { supabase: supabase as ReturnType<typeof createSupabaseClient>, user: error ? null : user }
}
