/**
 * Groq AI API 연동
 * 
 * llama-3.3-70b-versatile 모델을 사용하여 초고속 응답 생성
 */

import Groq from 'groq-sdk';

interface AIResponseResult {
  response: string;
  tokensUsed?: number;
}

/**
 * Groq을 사용한 AI 응답 생성 (비용 점감 및 속도 최적화: llama-3.3-70b-versatile, maxTokens: 1000)
 * 
 * @param prompt 사용자 질문
 * @returns AI 응답 및 사용된 토큰 수
 */
export async function generateGroqResponse(
  prompt: string
): Promise<AIResponseResult> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY가 설정되지 않았습니다.');
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: '사용자에게 직접적이고 명확한 답변을 제공하세요. 답변은 간결하게 작성하세요.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000, // 무료 티어 안전 범위 내에서 1000 -> 2000으로 상향
      temperature: 0.7,
    });

    const response = chatCompletion.choices[0]?.message?.content || '';
    
    if (!response) {
      throw new Error('Groq 응답이 비어있습니다.');
    }

    return {
      response,
      tokensUsed: chatCompletion.usage?.total_tokens,
    };
  } catch (error) {
    console.error('Groq 응답 생성 오류:', error);
    throw error;
  }
}
