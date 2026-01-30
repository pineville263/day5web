/**
 * AI 인사이트 분석 API Route
 * 
 * POST /api/ai/analyze
 * - 사용자 입력 수신
 * - 캐시 확인 (기존 응답 재사용으로 비용 절감)
 * - Gemini API를 통한 분석 (비용 최적화 모델 및 설정)
 * - 결과를 Supabase에 저장
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  generateAIResponse, 
  saveAIResponseAsync, 
  getCachedAIResponse 
} from '@/lib/ai/gemini';
import { generateGroqResponse } from '@/lib/ai/groq';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return Response.json(
        { error: 'SUPABASE_CONFIG_MISSING', message: '저장소 설정이 완료되지 않았습니다.' },
        { status: 503 }
      );
    }
    
    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'UNAUTHORIZED', message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, provider = 'google', category = 'analysis' } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return Response.json(
        { error: 'INVALID_INPUT', message: '분석할 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    const trimmedPrompt = prompt.trim();
    const startTime = Date.now();

    // 1. 캐시 확인 (비용 절감 핵심)
    const cached = await getCachedAIResponse(trimmedPrompt, category, user.id);
    if (cached) {
      console.log(`[AI Analyze] 캐시 히트: ${trimmedPrompt.substring(0, 20)}...`);
      return Response.json({
        data: {
          response: cached.response,
          tokensUsed: cached.tokensUsed,
          isCached: true,
          provider: 'cached'
        }
      });
    }

    // 2. AI 분석 실행
    try {
      console.log(`[AI Analyze] 새로운 분석 요청 (${provider}): ${trimmedPrompt.substring(0, 20)}...`);
      
      let result;
      if (provider === 'groq') {
        result = await generateGroqResponse(trimmedPrompt);
      } else {
        result = await generateAIResponse(trimmedPrompt, category);
      }
      
      // 3. DB 저장 (백그라운드 처리)
      saveAIResponseAsync({
        userId: user.id,
        prompt: trimmedPrompt,
        response: result.response,
        category: category,
        tokensUsed: result.tokensUsed,
        // @ts-ignore: provider 컬럼 대응이 필요한 경우 (임시 무시)
        provider: provider
      });

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`[AI Analyze] 모델: ${provider}, 응답 시간: ${duration}ms`);

      return Response.json({
        data: {
          response: result.response,
          tokensUsed: result.tokensUsed,
          isCached: false,
          provider
        }
      });
    } catch (error: any) {
      console.error('[AI Analyze] Gemini API 오류:', error);
      
      // 할당량 초과 에러 처리
      if (error.message === 'QUOTA_EXCEEDED' || error.message?.includes('429')) {
        const customMessage = provider === 'google' 
          ? "구글 할당량이 초과되었습니다. Groq 엔진으로 변경하여 시도해 보세요." 
          : "Groq 할당량이 초과되었습니다. 잠시 후 다시 시도해 주세요.";

        return Response.json(
          { 
            error: 'QUOTA_EXCEEDED',
            message: customMessage 
          },
          { status: 429 }
        );
      }

      return Response.json(
        { 
          error: 'AI_SERVICE_ERROR',
          message: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[AI Analyze] 내부 오류:', error);
    return Response.json(
      { error: 'INTERNAL_SERVER_ERROR', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
