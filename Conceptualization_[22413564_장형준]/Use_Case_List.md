# 3. Use case list

[⬅️ Back to Contents](./Conceptualization.md)

---

| No | Use Case | Actor | Description |
| :--- | :--- | :--- | :--- |
| 1 | **Sign Up** | Guest | 아이디, 비밀번호, 이메일 등의 정보를 입력하여 신규 회원으로 등록한다. |
| 2 | **Login** | Member | 등록된 계정 정보를 인증하고 JWT 기반의 Access/Refresh 토큰을 발급받는다. |
| 3 | **Refresh Token** | Member | 만료된 Access 토큰을 Refresh 토큰을 이용하여 안전하게 재발급받는다. |
| 4 | **Logout** | Member | 사용 세션을 종료하고 서버에 저장된 Refresh 토큰 정보를 파기한다. |
| 5 | **Find Login ID** | Guest | 등록된 이메일 인증을 통해 분실한 로그인 아이디 정보를 확인한다. |
| 6 | **View Profile** | Member | 자신의 프로필 정보, 보유 코인, 캐릭터 레벨 및 장착 아이템을 조회한다. |
| 7 | **Update Profile** | Member | 닉네임, 성별, 혈액형, MBTI 등 개인 프로필 정보를 수정 및 관리한다. |
| 8 | **Update Security** | Member | 계정 보안을 위해 이메일 주소 또는 비밀번호를 변경 및 갱신한다. |
| 9 | **Manage Settings** | Member | 알림 주기, 알림 시각, 푸시 알림 사용 여부 등 개인화 설정을 관리한다. |
| 10 | **Scheduled Question** | Member | 시스템 설정에 따라 정해진 시간에 정기 감정 회고 질문을 수신한다. |
| 11 | **On-Demand Question** | Member | 사용자가 필요시 하루 1회 추가적인 감정 점검 질문을 요청하여 수신한다. |
| 12 | **Submit Answer** | Member | 질문에 대한 답변을 저장하고, 보상으로 코인 획득 및 캐릭터를 성장시킨다. |
| 13 | **View Answer History** | Member | 과거에 작성한 자신의 감정 답변 기록을 타임라인 형태로 조회한다. |
| 14 | **Purchase Item** | Member | 활동 보상으로 획득한 코인을 사용하여 상점에서 꾸미기 아이템을 구매한다. |
| 15 | **Equip Items** | Member | 구매한 아이템 목록 중 캐릭터에 적용할 아이템을 선택하여 장착한다. |
| 16 | **View Posts** | Member | 익명 커뮤니티의 게시글 목록 및 상세 내용을 조회한다. |
| 17 | **Create Post** | Member | AI 필터링 검증을 통과한 긍정적인 내용의 익명 게시글을 작성한다. |
| 18 | **Edit/Delete Post** | Member | 자신이 작성한 게시글에 한해 내용을 수정하거나 영구적으로 삭제한다. |
| 19 | **View Comments** | Member | 특정 게시글에 달린 익명 댓글 목록을 상세히 조회한다. |
| 20 | **Manage Comment** | Member | 댓글을 작성하거나, 본인이 작성한 댓글을 수정 및 삭제 관리한다. |
| 21 | **AI Empathy Chat** | Member | AI 챗봇과 대화하며 실시간으로 공감 메시지 및 힐링 콘텐츠를 제공한다. |

---

**[Next Step: 4. Concept of operation](./Concept_Of_Operation.md)**
