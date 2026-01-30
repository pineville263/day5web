import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // Supabase 클라이언트가 초기화되지 않았으면 (환경 변수 누락 등) 그대로 진행
  if (!supabase) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 현재 경로
  const path = request.nextUrl.pathname;

  // 공개 라우트 목록 (로그인 없이 접근 가능)
  // _next, api, static 파일 등은 제외
  const isPublicRoute = 
    path === '/login' || 
    path.startsWith('/api/') || 
    path.startsWith('/_next/') || 
    path.includes('.') || /* favicon.ico, images etc */
    path === '/auth/callback'; // Callback route handling

  // 로그인이 되어있지 않은데 보호된 라우트에 접근하려는 경우
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // 로그인 후 원래 페이지로 돌아오기 위한 리다이렉트 URL 설정 (선택 사항)
    // url.searchParams.set('next', path); 
    return NextResponse.redirect(url);
  }

  // 로그인이 되어있는데 로그인 페이지에 접근하려는 경우
  if (user && path === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
