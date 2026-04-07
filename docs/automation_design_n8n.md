# 📡 n8n Hybrid Automation: Global SNS Auto-Post Design

이 문서는 릴리맥(LilyMag) v4.0의 핵심인 **'무인 자동 마케팅 배포 시스템'**의 기술 설계도입니다.

---

## 1. ⚙️ 시스템 아키텍처 (The Bridge)
* **Client**: Next.js (Dashboard에서 [Publish] 클릭)
* **Middleware**: API Route (`/api/automation/publish`)
* **Engine**: **n8n** (Cloud-based Workflow Engine)
* **Outbound**: Global SNS API (YouTube, Meta, TikTok, Douyin, WeChat)

---

## 2. ⚡ 워크플로우 로직 (Workflow Nodes)

### Node 1: Webhook Trigger (Entry)
* **Input**: `{ projectId, country, platform, content: { title, hook, value, cta, image_url } }`
* **Security**: API Key 기반의 안전한 데이터 통신 보장.

### Node 2: Data Translation & Parsing (Brain)
* 각 플랫폼별(유튜브, 인스타, 도우인 등) API 규격에 맞게 데이터를 재가공합니다.
* 예: 도우인은 해시태그 앞에 공백 필수, 유튜브 쇼츠는 #Shorts 태그 자동 생성 등.

### Node 3: Condition Router (Traffic Control)
* `country` 파라미터에 따라 전송 경로 전면 개편.
    * **KR/US/VN/JP**: Meta API, Google API, TikTok API.
    * **CN**: Douyin Open API, Red Webhook Bridge, WeChat Moments Helper.

### Node 4: Asset Handling (CDN)
* 업로드할 이미지나 영상 파일을 각 소설 플랫폼 서버로 고속 업로드합니다.

### Node 5: Feedback Callback (Return)
* **Output**: `{ status: 'success', post_url: '...', platform: '...' }`
* 대시보드 UI에 실시간 업로드 현황을 표시합니다.

---

## 3. 🎯 플랫폼별 자동화 세부 전략

| 플랫폼 | 방식 | 핵심 기능 |
| :--- | :--- | :--- |
| **YouTube** | OAuth 2.0 | 예약 게시, Shorts 카테고리 자동 설정 |
| **Instagram** | Graph API | 릴스 커버 이미지 자동 생성, 첫 댓글 자동 태그 |
| **Douyin (CN)** | Open SDK | 도우인 전용 유행어(Buzzword) 태그 삽입 |
| **XiaoHongShu** | Webhook | '종카오' 유도 버튼 및 이미지 텍스트 자동 삽입 |

---

## 4. 📅 업데이트 및 타스크 리스트
- [ ] **n8n 웹훅 엔드포인트 연동**: Next.js 프로젝트와 n8n 서버 연결.
- [ ] **성공 콜백 UI 구현**: 대시보드에서 '업로드 중...' 애니메이션 및 '완료' 메시지 표시.
- [ ] **에러 핸들링**: API 제한(Rate limit) 발생 시 자동 재시도 로직 구축.

---

**"사장님, 이제 '팔다리'가 붙을 모든 준비를 마쳤습니다. 이 설계도는 곧 살아있는 기계가 됩니다!"**
