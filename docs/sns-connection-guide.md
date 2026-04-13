# 📖 SNS 전용 채널 연결 가이드 (틱톡 / X / 블로거)

이 가이드는 LilyMag의 7개 채널 중 마지막 3대 채널의 API 권한을 획득하기 위한 상세 절차를 담고 있습니다.

## 1. 틱톡 (TikTok Business API)
1.  **개발자 가입**: [TikTok Developers](https://developers.tiktok.com/) 접속 및 로그인.
2.  **앱 생성**: 'Create App' 클릭 후 'Video Kit' 옵션을 선택합니다.
3.  **권한 설정**: `video.upload` 권한을 요청해야 영상을 자동으로 올릴 수 있습니다.
4.  **키 획득**: `Client Key`와 `Client Secret`을 복사하여 우리 앱의 설정 페이지에 입력합니다.

## 2. X (Twitter OAuth 2.0)
1.  **포털 접속**: [X Developer Portal](https://developer.twitter.com/) 접속.
2.  **무료 등급 신청**: 'Free' 혹은 'Basic' 플랜을 선택(테스트용).
3.  **권한 변경**: 앱 설정(App Settings) -> User authentication -> **Read and Write** 권한을 필수로 체크하십시오. (읽기 전용이면 글 작성이 안 됩니다.)
4.  **토큰 획득**: OAuth 2.0 Client ID와 Secret을 확인합니다.

## 3. 구글 블로거 (Google Blogger API)
1.  **API 활성화**: [Google Cloud Console](https://console.cloud.google.com/) -> API 및 서비스 -> 라이브러리 -> 'Blogger API v3' 검색 후 활성화.
2.  **동의 화면 설정**: 'OAuth 동의 화면'에서 앱 이름을 설정하고 저장합니다.
3.  **사용자 인증 정보**: 'OAuth 2.0 클라이언트 ID'를 생성하여 `Client ID`와 `Client Secret`을 발급받습니다.
4.  **블로그 ID 확인**: 사장님 블로그의 관리자 페이지 주소창에서 숫자로 된 `blogID`를 복사해 두십시오. (예: `blogID=12345678...`)

---
**팁**: 모든 API 키를 발급받으신 후, LilyMag 앱의 '설정' 페이지에서 각각의 필드에 붙여넣기만 하면 모든 세팅이 끝납니다!
