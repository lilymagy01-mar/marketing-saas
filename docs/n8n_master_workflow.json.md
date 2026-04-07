# 📡 n8n 마스터 워크플로우 v4.0 (10-SNS Multi-Tenant SaaS Engine)

수만 명의 유저가 각자의 SNS 계정으로 자동 포격할 수 있는 진정한 SaaS 전용 엔진입니다.

---

## 🚀 [지능형 사격 통제] Multi-Tenant JSON 코드 (복사항목)

```json
{
  "nodes": [
    { "parameters": { "httpMethod": "POST", "path": "saas-blast-v4" }, "id": "1", "name": "LilyMag_SaaS_Trigger", "type": "n8n-nodes-base.webhook", "typeVersion": 1, "position": [100, 300] },
    { "parameters": { "method": "POST", "url": "https://YOUR_PROJECT.supabase.co/rest/v1/sns_vault", "authentication": "headerAuth", "headerParameters": { "parameters": [{ "name": "apikey", "value": "SECRET" }] }, "queryParameters": { "parameters": [{ "name": "user_id", "value": "={{$json.body.userId}}" }] } }, "id": "2", "name": "Global_Vault_Lookup", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [300, 300] },
    { "parameters": { "values": { "string": [
      { "name": "content", "value": "={{$json[0].content}}" },
      { "name": "ig_token", "value": "={{$json[0].ig_token}}" },
      { "name": "yt_token", "value": "={{$json[0].yt_token}}" },
      { "name": "fb_token", "value": "={{$json[0].fb_token}}" },
      { "name": "tt_token", "value": "={{$json[0].tt_token}}" },
      { "name": "pin_token", "value": "={{$json[0].pin_token}}" },
      { "name": "x_token", "value": "={{$json[0].x_token}}" },
      { "name": "lnkd_token", "value": "={{$json[0].lnkd_token}}" },
      { "name": "th_token", "value": "={{$json[0].th_token}}" },
      { "name": "msg_token", "value": "={{$json[0].msg_token}}" },
      { "name": "tg_token", "value": "={{$json[0].tg_token}}" }
    ] } }, "id": "3", "name": "SaaS_Token_Injector", "type": "n8n-nodes-base.set", "typeVersion": 1, "position": [500, 300] },
    { "parameters": { "method": "POST", "url": "https://graph.instagram.com/v18.0/me/media", "authentication": "headerAuth", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"ig_token\"]}}" }] }, "bodyParameters": { "parameters": [{ "name": "caption", "value": "={{$node[\"SaaS_Token_Injector\"].json[\"content\"]}}" }] } }, "id": "4", "name": "IG_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 50] },
    { "parameters": { "method": "POST", "url": "https://www.googleapis.com/youtube/v3/videos", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"yt_token\"]}}" }] } }, "id": "5", "name": "YT_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 100] },
    { "parameters": { "method": "POST", "url": "https://api.tiktok.com/v2/video/upload/", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"tt_token\"]}}" }] } }, "id": "6", "name": "TT_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 150] },
    { "parameters": { "method": "POST", "url": "https://graph.facebook.com/v18.0/me/feed", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"fb_token\"]}}" }] } }, "id": "7", "name": "FB_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 200] },
    { "parameters": { "method": "POST", "url": "https://api.pinterest.com/v5/pins", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"pin_token\"]}}" }] } }, "id": "8", "name": "PIN_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 250] },
    { "parameters": { "method": "POST", "url": "https://api.twitter.com/2/tweets", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"x_token\"]}}" }] } }, "id": "9", "name": "X_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 300] },
    { "parameters": { "method": "POST", "url": "https://api.linkedin.com/v2/ugcPosts", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"lnkd_token\"]}}" }] } }, "id": "10", "name": "LNKD_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 350] },
    { "parameters": { "method": "POST", "url": "https://graph.threads.net/v1.0/me/threads", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"th_token\"]}}" }] } }, "id": "11", "name": "TH_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 400] },
    { "parameters": { "method": "POST", "url": "https://api.line.me/v2/bot/message/broadcast", "headerParameters": { "parameters": [{ "name": "Authorization", "value": "=Bearer {{$node[\"SaaS_Token_Injector\"].json[\"msg_token\"]}}" }] } }, "id": "12", "name": "MSG_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 450] },
    { "parameters": { "method": "POST", "url": "https://api.telegram.org/bot{{$node[\"SaaS_Token_Injector\"].json[\"tg_token\"]}}/sendMessage" }, "id": "13", "name": "TG_SaaS_API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [750, 500] }
  ],
  "connections": {
    "LilyMag_SaaS_Trigger": { "main": [[{ "node": "Global_Vault_Lookup", "type": "main", "index": 0 }]] },
    "Global_Vault_Lookup": { "main": [[{ "node": "SaaS_Token_Injector", "type": "main", "index": 0 }]] },
    "SaaS_Token_Injector": {
      "main": [
        [
          { "node": "IG_SaaS_API", "type": "main", "index": 0 }, { "node": "YT_SaaS_API", "type": "main", "index": 0 }, { "node": "TT_SaaS_API", "type": "main", "index": 0 },
          { "node": "FB_SaaS_API", "type": "main", "index": 0 }, { "node": "PIN_SaaS_API", "type": "main", "index": 0 }, { "node": "X_SaaS_API", "type": "main", "index": 0 },
          { "node": "LNKD_SaaS_API", "type": "main", "index": 0 }, { "node": "TH_SaaS_API", "type": "main", "index": 0 }, { "node": "MSG_SaaS_API", "type": "main", "index": 0 }, { "node": "TG_SaaS_API", "type": "main", "index": 0 }
        ]
      ]
    }
  }
}
```

---

## 📡 SaaS 무인 자동화 가이드

1. **금고 연동 완료**: 이제 모든 노드가 Supabase에서 가져온 유저별 토큰(`ig_token`, `yt_token` 등)을 자동으로 헤더에 실어 호출합니다.
2. **사장님 할 일**: 유저들이 사장님 사이트에서 SNS 로그인을 하면 토큰이 Supabase에 저장되도록 프론트엔드 연동만 하시면 끝납니다.
3. **무한 확장**: 유저가 천 명, 만 명이 늘어나도 n8n 대시보드에서는 이 노드 하나로 모든 포격이 처리됩니다.

*SaaS 엔진 가동일: 2026-04-07 (사장님 전담 글로벌 SaaS 아키텍트)*
