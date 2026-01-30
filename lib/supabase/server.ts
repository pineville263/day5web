/**
 * 서버용 Supabase 클라이언트
 * 
 * 서버 컴포넌트 및 API Routes에서 사용하는 Supabase 클라이언트
 * 쿠키를 통한 세션 관리
 * 
 * 환경 변수가 없을 경우 null을 반환하여 UI 테스트 가능
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function createClient(): Promise<SupabaseClient | null> {
  // NEXT_PUBLIC_ 접두사가 있는 변수 우선 확인, 없으면 접두사 없는 변수 확인 (서버 사이드 호환성)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  // 환경 변수가 없으면 null 반환 (UI 테스트용)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase Server] 필수 환경 변수가 누락되었습니다:', {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY
    });
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 쿠키 설정 실패 시 무시 (미들웨어에서 처리됨)
          }
        },
      },
    }
  );
}
