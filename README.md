# evangelism-web

양재온누리교회 허브대학부 허뤠이 전도 페이지. hub_web의 `/evangelism`을
독립 레포로 분리한 공개 전도용 웹사이트입니다.

- Next.js 15 (App Router) + React 18 + Emotion
- 루트(`/`)가 전도 페이지입니다. 탭은 `?tab=` 쿼리로 동기화됩니다.
- 질문 접수(익명)는 `/api/evangelism/questions` (POST)에서 처리합니다.
- 질문은 hub_web과 **같은 Supabase 프로젝트의 `evangelism_questions` 테이블**에 쌓이며,
  답변/관리는 기존 hub_web의 관리자 페이지에서 계속 처리합니다.

## 로컬 개발

```bash
pnpm install   # 또는 npm install
pnpm dev
```

`http://localhost:3000` 접속.

## 환경 변수

`.env.example` 참고. 아래 세 개가 필요합니다 (hub_web과 동일한 값).

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버에서 질문 insert에 사용하는 서비스 롤 키 |

## Vercel 배포

1. 이 레포를 GitHub에 push.
2. Vercel에서 New Project → 이 레포 import.
3. Environment Variables에 위 세 변수 등록.
4. Deploy. 프레임워크는 Next.js로 자동 감지됩니다.

> `evangelism_questions` 테이블은 hub_web에서 이미 만들어 쓰고 있으므로
> 별도 마이그레이션은 필요 없습니다 (같은 DB 공유).
