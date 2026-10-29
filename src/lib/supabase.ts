import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 확인하세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드용 클라이언트 (서비스 역할 키 사용)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
  }
);
