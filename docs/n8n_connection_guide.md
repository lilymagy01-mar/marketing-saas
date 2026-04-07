# 📡 n8n - LilyMag v4.0 마케팅 사령탑 연결 가이드

이 문서는 n8n 워크플로우와 LilyMag 마케팅 자동화 대시보드를 연동하여 무인 포스팅 시스템을 완성하는 방법을 설명합니다.

---

## 1. n8n 워크플로우 설정 (Webhook)

### **1.1 Webhook 노드 생성**
- n8n에서 새로운 워크플로우를 생성합니다.
- `Webhook` 노드를 추가하고 다음과 같이 설정합니다:
  - **HTTP Method**: `POST`
  - **Path**: `lilymag-auto-post`
  - **Respond**: `Immediately` (응답 속도 최적화)

### **1.2 Webhook URL 복사**
- 노드 상단의 `Test URL` 또는 `Production URL`을 복사합니다.
- **주의**: 실전 운영 시에는 반드시 `Production URL`을 사용해야 합니다.

---

## 2. 대시보드(LilyMag) 설정

- 대시보드의 `Settings` 페이지로 이동합니다.
- **[Automation Bridge URL]** 필드에 복사한 주소를 입력합니다.
- `Save` 버튼을 누르면 모든 준비가 끝납니다.

---

## 3. 데이터 전송 규격 (JSON Payload)

사령탑에서 `Publish` 버튼을 누르거나 `Auto-Pilot`이 작동할 때, n8n으로 전송되는 데이터 예시입니다. n8n의 다음 노드에서 이 필드들을 활용하십시오.

```json
{
  "id": "unique-campaign-id-12345",
  "shopName": "Lily Flower - Seoul Main",
  "persona": "Elegant & Premium",
  "targetAudience": "Office Workers (20-40s)",
  "title": "4월의 봄, 당신의 책상에 튤립 한 송이",
  "description": "봄의 정원을 그대로 옮겨 놓은 듯한 싱그러운 튤립...",
  "content": "AI가 생성한 전체 마케팅 카피 텍스트...",
  "contentType": "Shorts", // Shorts, Blog, Social 중 하나
  "platform": "Global", // KR, US, CN 등
  "imageUrl": "https://images.unsplash.com/photo-example-123",
  "timestamp": "2026-04-07T12:00:00Z"
}
```

---

## 4. n8n 추천 워크플로우 구성
1. **Webhook**: 데이터 수신
2. **AI Agent (Optional)**: 수신된 텍스트를 각 SNS 채널의 길이에 맞게 재편집
3. **Instagram/YouTube API**: 실제 포스팅 실행
4. **Slack/Notification**: 사장님께 "포스팅 완료" 알림 발송

*최종 업데이트: 2026-04-07 (LilyMag Global Marketing Team)*
