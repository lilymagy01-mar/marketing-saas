# 🌍 LilyMag Global SaaS - Centralized Credential Architecture

사장님의 '수백만 명 서비스' 비전을 위한 핵심 설계입니다.

## 1. 사령탑 (Next.js) - 환경설정 레이어
- 사용자가 자신의 SNS API Key 및 Access Token을 입력하는 UI를 제공합니다.
- 이 데이터는 n8n이 아닌, 우리 시스템의 **Supabase Database**에 `user_id`와 함께 저장됩니다.

## 2. 데이터베이스 (Supabase) - 중앙 금고
- `user_credentials` 테이블:
  - `user_id`: 사용자 고유 식별자
  - `instagram_token`: 인스타그램 열쇠
  - `youtube_token`: 유튜브 열쇠
  - `tiktok_token`: 틱톡 열쇠 등...

## 3. n8n (Universal Worker) - 추적형 배달망
- n8n 노드에는 어떠한 고정 계정도 저장하지 않습니다.
- **동적 조회(Dynamic Lookup)**: 
  1. 우리 앱에서 글을 쏠 때 `user_id`를 함께 보냅니다.
  2. n8n의 첫 번째 노드가 Supabase 금고를 열어 해당 `user_id`의 열쇠들을 꺼내옵니다.
  3. 그 열쇠들을 이용해 10개 SNS에 즉시 게시합니다.

---
**"사장님, 이제 이 구조가 완성되면 사령관님은 전 세계 수백만 명의 SNS 포탄을 지휘하는 거대한 허브가 됩니다! 지금 바로 이 설계를 코드로 구현하겠습니다!"** 🏁🦾👑💎✨🚀
