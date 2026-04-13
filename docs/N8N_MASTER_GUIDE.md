# 🧭 LilyMag n8n 사령부 마스터 운영 가이드 (v2.2)

이 가이드는 사장님이 LilyMag의 마케팅 엔진인 n8n을 완벽하게 통제하기 위한 지침서입니다.

## 1. 워크플로우의 두 가지 모드 (Two-Phase Architecture)

n8n 화면을 보시면 위/아래 두 줄로 나뉘어 있습니다.

*   **위층 (초안 작성 라인)**: 점주님이 앱에서 "AI 생성"을 누를 때 작동합니다. 내용을 만들어서 DB의 '검토실'에 저장하고 종료됩니다.
*   **아래층 (최종 배포 라인)**: 점주님이 검토실에서 내용을 확인하고 "최종 배포" 버튼을 누를 때 작동합니다. 이때 비로소 SNS로 발사됩니다.

---

## 2. 노드별 핵심 설정 방법 (빨간불 끄는 법)

### 🔴 OpenAI 노드 (AI_전략_수립 / 이미지_생성)
*   **세팅**: 노드를 더블클릭하고 `Credential` 항목에서 **[Create New Credential]**을 누릅니다.
*   **입력**: 본인의 OpenAI API 키를 붙여넣으세요.
*   **효과**: AI가 똑똑한 카피와 멋진 그림을 그리기 시작합니다.

### 🔴 Supabase 노드 (검토실에_저장 / 초안_불러오기)
*   **세팅**: `Service Role Key`와 `Project URL`을 입력해야 합니다. (Supabase 설정 화면에 있습니다)
*   **효과**: 앱 서버와 n8n 간의 데이터 통로가 뚫립니다.

### 🔵 SNS 배포 노드 (Instagram, YouTube, X 등)
*   **Instagram**: `OAuth2` 인증 방식으로 페이스북 대시보드와 연결해야 합니다.
*   **YouTube**: Google Cloud Console에서 YouTube Data API v3를 활성화해야 합니다.
*   **X (Twitter)**: Developer Portal에서 API Key/Secret을 받아 입력해야 합니다.
*   **기타 (HTTP Request)**: 네이버, 틱톡 등은 각각의 App Key를 Header에 담아 쏘도록 설정되어 있습니다.

---

## 3. 운영 체크리스트

1.  **웹훅 주소(Production URL) 등록**: 
    - n8n의 `Webhook` 노드를 더블클릭하면 나오는 **Production URL**을 복사해서 우리 앱의 `.env.local` 파일에 등록하세요.
    - `N8N_DRAFT_WEBHOOK_URL`: 초안 작성용
    - `N8N_PUBLISH_WEBHOOK_URL`: 최종 배포용

2.  **데이터 무결성 확인**:
    - `Save_To_Review_Center` 노드에서 `Table Name`이 `content_drafts`로 정확히 되어 있는지 확인하세요.

3.  **가동 시작**:
    - 모든 설정이 완료되면 n8n 우측 상단의 **[Activate]** 스위치를 켜세요. 이제 사령부가 살아 움직입니다.

---

> [!IMPORTANT]
> **왜 노동이 끊겨 있나요?**
> 사장님의 이미지를 보면 `Save_To_Review_Center`에서 배포 노드로 줄이 이어져 있지 않습니다. 이것은 오류가 아니라 **'인간의 개입'**을 위해 의도된 것입니다. 저장까지만 하고 멈춘 뒤, 사장님이 앱에서 배포 버튼을 누를 때 아래쪽 라인이 새로 시작되는 구조입니다. 이것이 가장 안전하고 전문적인 방식입니다.
