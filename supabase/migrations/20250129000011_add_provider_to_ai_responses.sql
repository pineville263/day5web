-- ai_responses 테이블에 provider 컬럼 추가
ALTER TABLE ai_responses ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'google';

-- provider 컬럼 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_ai_responses_provider ON ai_responses(provider);

-- 기존 데이터 코멘트 추가
COMMENT ON COLUMN ai_responses.provider IS 'AI 제공자 (google, groq 등)';
