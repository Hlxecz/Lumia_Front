# Sequence Diagram (PlantUML Source Code)

[⬅️ Back to Contents](./Design.md)

---

이 문서는 `Sequence_diagram.md`에서 정의한 21개 유스케이스(U.C)의 Mermaid 시퀀스 다이어그램을 **PlantUML 문법**으로 변환하여 정리한 소스 코드 보관 문서입니다. 
각 유스케이스의 `@startuml`부터 `@endum`까지의 블록을 그대로 복사하여 PlantUML 에디터 혹은 도구에 붙여넣어 활용하실 수 있습니다.

---

## 목차
1. [Module 1. 회원 및 인증 관리 (U.C 1 ~ 5)](#module-1-회원-및-인증-관리-uc-1--5)
2. [Module 2. 프로필 및 환경 설정 (U.C 6 ~ 9)](#module-2-프로필-및-환경-설정-uc-6--9)
3. [Module 3. 질문 발급 및 답변 기록 (U.C 10 ~ 13)](#module-3-질문-발급-및-답변-기록-uc-10--13)
4. [Module 4. 상점 및 아바타 장착 (U.C 14 ~ 15)](#module-4-상점-및-아바타-장착-uc-14--15)
5. [Module 5. 익명 커뮤니티 및 댓글 (U.C 16 ~ 20)](#module-5-익명-커뮤니티-및-댓글-uc-16--20)
6. [Module 6. AI 공감 대화 (U.C 21)](#module-6-ai-공감-대화-uc-21)

---

## Module 1. 회원 및 인증 관리 (U.C 1 ~ 5)

### U.C 1 - Sign Up (회원가입)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant UC as "UserController"
participant US as "UserService"
participant PE as "PasswordEncoder"
participant UR as "UserRepository"
participant USR as "UserSettingRepository"

Client -> UC : POST /api/users/signup (SignupRequestDto)
activate UC
UC -> US : signup(SignupRequestDto)
activate US
US -> PE : encode(rawPassword)
activate PE
PE --> US : encodedPassword
deactivate PE
US -> UR : save(UserEntity)
activate UR
UR --> US : savedUser
deactivate UR
US -> USR : save(DefaultUserSetting)
activate USR
USR --> US : savedUserSetting
deactivate USR
US --> UC : User
deactivate US
UC --> Client : 201 Created (userId)
deactivate UC
@endum
```

### U.C 2 - Login (로그인)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant UC as "UserController"
participant US as "UserService"
participant PE as "PasswordEncoder"
participant JWT as "JwtUtil"
participant RTS as "RefreshTokenService"
participant RTR as "RefreshTokenRepository"

Client -> UC : POST /api/users/login (LoginRequestDto)
activate UC
UC -> US : login(userId, password)
activate US
US -> PE : matches(rawPassword, encodedPassword)
activate PE
PE --> US : isMatch (true)
deactivate PE
US --> UC : loginSuccess
deactivate US

UC -> JWT : generateToken(userId)
activate JWT
JWT --> UC : accessToken
deactivate JWT

UC -> RTS : createOrUpdateRefreshToken(userId)
activate RTS
RTS -> RTR : save(RefreshTokenEntity)
activate RTR
RTR --> RTS : savedRefreshToken
deactivate RTR
RTS --> UC : RefreshToken
deactivate RTS

UC --> Client : 200 OK (LoginResponseDto: Access/Refresh Token)
deactivate UC
@endum
```

### U.C 3 - Refresh Token (토큰 갱신)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant UC as "UserController"
participant RTS as "RefreshTokenService"
participant RTR as "RefreshTokenRepository"
participant JWT as "JwtUtil"

Client -> UC : POST /api/users/refresh (RefreshTokenRequestDto)
activate UC
UC -> RTS : findByToken(refreshToken)
activate RTS
RTS -> RTR : findByToken(token)
activate RTR
RTR --> RTS : RefreshTokenEntity
deactivate RTR
RTS -> RTS : verifyExpiration(RefreshTokenEntity)
note over RTS : 만료 여부 검증
RTS --> UC : VerifiedRefreshToken
deactivate RTS

UC -> JWT : generateToken(userId)
activate JWT
JWT --> UC : newAccessToken
deactivate JWT

UC --> Client : 200 OK (TokenRefreshResponseDto: New AccessToken)
deactivate UC
@endum
```

### U.C 4 - Logout (로그아웃)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant Filter as "JwtAuthenticationFilter"
participant UC as "UserController"
participant RTS as "RefreshTokenService"
participant RTR as "RefreshTokenRepository"

Client -> Filter : POST /api/users/logout (Header: Bearer AccessToken)
activate Filter
note over Filter : 토큰 유효성 검사 및 SecurityContext에 인증 정보 주입
Filter -> UC : request dispatch
activate UC
UC -> RTS : deleteByUserId(currentUserId)
activate RTS
RTS -> RTR : deleteByUser(User)
activate RTR
RTR --> RTS : deletedCount
deactivate RTR
RTS --> UC : success
deactivate RTS
UC --> Client : 200 OK (Logout successfully)
deactivate UC
deactivate Filter
@endum
```

### U.C 5 - Find Login ID (아이디 찾기)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant UC as "UserController"
participant US as "UserService"
participant UR as "UserRepository"

Client -> UC : GET /api/users/find-id?email=user@email.com
activate UC
UC -> US : findUserIdByEmail(email)
activate US
US -> UR : findByEmail(email)
activate UR
UR --> US : Optional<User>
deactivate UR
US --> UC : userId
deactivate US
UC --> Client : 200 OK (UserIdResponseDto: userId)
deactivate UC
@endum
```

---

## Module 2. 프로필 및 환경 설정 (U.C 6 ~ 9)

### U.C 6 - View Profile (프로필 조회)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant Filter as "JwtAuthenticationFilter"
participant UC as "UserController"
participant US as "UserService"
participant UR as "UserRepository"

Client -> Filter : GET /api/users/me/profile (Header: Bearer AccessToken)
activate Filter
note over Filter : 토큰 유효성 검사 및 SecurityContext에 인증 정보 주입
Filter -> UC : request dispatch
activate UC
UC -> US : getUserProfile(currentUserId)
activate US
US -> UR : findByUserId(currentUserId)
activate UR
UR --> US : UserEntity
deactivate UR
US --> UC : UserProfileResponseDto
deactivate US
UC --> Client : 200 OK (UserProfileResponseDto)
deactivate UC
deactivate Filter
@endum
```

### U.C 7 - Update Profile (프로필 수정)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant Filter as "JwtAuthenticationFilter"
participant UC as "UserController"
participant US as "UserService"
participant UR as "UserRepository"

Client -> Filter : PUT /api/users/me/profile (UserProfileUpdateRequestDto)
activate Filter
note over Filter : 토큰 유효성 검사 및 SecurityContext에 인증 정보 주입
Filter -> UC : request dispatch
activate UC
UC -> US : updateUserProfile(currentUserId, UserProfileUpdateRequestDto)
activate US
US -> UR : findByUserId(currentUserId)
activate UR
UR --> US : UserEntity
deactivate UR
US -> US : Update entity fields (username, gender, bloodType, mbti)
US --> UC : Updated UserProfileResponseDto
deactivate US
UC --> Client : 200 OK (UserProfileResponseDto)
deactivate UC
deactivate Filter
@endum
```

### U.C 8 - Update Security (보안 정보 수정 - 비밀번호 변경)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant Filter as "JwtAuthenticationFilter"
participant UC as "UserController"
participant US as "UserService"
participant PE as "PasswordEncoder"
participant UR as "UserRepository"

Client -> Filter : PUT /api/users/me/password (PasswordUpdateRequestDto)
activate Filter
Filter -> UC : request dispatch
activate UC
UC -> US : updateUserPassword(currentUserId, currentPassword, newPassword)
activate US
US -> UR : findByUserId(currentUserId)
activate UR
UR --> US : UserEntity
deactivate UR
US -> PE : matches(currentPassword, DBPassword)
activate PE
PE --> US : isMatch (true)
deactivate PE
US -> PE : encode(newPassword)
activate PE
PE --> US : newEncodedPassword
deactivate PE
US -> US : Set user new password
US --> UC : success
deactivate US
UC --> Client : 200 OK (Password updated successfully)
deactivate UC
deactivate Filter
@endum
```

### U.C 9 - Manage Settings (환경설정 변경)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant Filter as "JwtAuthenticationFilter"
participant UC as "UserController"
participant USS as "UserSettingService"
participant USR as "UserSettingRepository"

Client -> Filter : PUT /api/users/me/settings (UserSettingDto)
activate Filter
Filter -> UC : request dispatch
activate UC
UC -> USS : updateUserSettings(currentUserId, UserSettingDto)
activate USS
USS -> USR : findByUser_Id(currentUserId)
activate USR
USR --> USS : Optional<UserSetting>
deactivate USR
USS -> USS : Update settings (interval, time, pushEnabled)
USS --> UC : Updated UserSettingDto
deactivate USS
UC --> Client : 200 OK (UserSettingDto)
deactivate UC
deactivate Filter
@endum
```

---

## Module 3. 질문 발급 및 답변 기록 (U.C 10 ~ 13)

### U.C 10 - Scheduled Question (정기 질문 발송 및 조회)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant QC as "QuestionController"
participant QS as "QuestionService"
participant USR as "UserSettingRepository"
participant QR as "QuestionRepository"

Client -> QC : GET /api/questions/today
activate QC
QC -> QS : getScheduledQuestionForUser(currentUserId)
activate QS
note over QS : 1. 유저의 UserSetting 조회\n2. 최종 발급일자와 현재 시간대 확인\n3. 이미 오늘 발급된 이력이 있는가?

alt 신규 발급 필요
    QS -> QR : findRandomActiveQuestionByType('DAILY')
    activate QR
    QR --> QS : QuestionEntity
    deactivate QR
    QS -> USR : save / update (lastIssuedQuestionId, lastIssuedAt)
else 기존 발급 질문 반환
    note over QS : UserSetting에 설정된 질문 ID로 쿼리 수행
end

QS --> QC : NewMessageResponseDto (QuestionDto)
deactivate QS
QC --> Client : 200 OK (NewMessageResponseDto)
deactivate QC
@endum
```

### U.C 11 - On-Demand Question (온디맨드 추가 질문 발급)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant QC as "QuestionController"
participant QS as "QuestionService"
participant USR as "UserSettingRepository"
participant UAR as "UserAnswerRepository"
participant QR as "QuestionRepository"

Client -> QC : POST /api/questions/ondemand
activate QC
QC -> QS : getOnDemandQuestion(currentUserId)
activate QS

QS -> UAR : countByUser(User)
activate UAR
UAR --> QS : totalAnswersCount
deactivate UAR

note over QS : 오늘 이미 온디맨드 질문에 답변을 작성했는지 확인 (일일 추가 1회 제한 검증)

alt 발급 불가 (하루 1회 제한 초과)
    QS --> QC : Throw IllegalArgumentException
    QC --> Client : 429 Too Many Requests
else 발급 가능
    QS -> QR : findRandomActiveQuestionByType('ONDEMAND')
    activate QR
    QR --> QS : QuestionEntity
    deactivate QR
    QS -> USR : update (lastDailyMoodAt = now)
    QS --> QC : QuestionDto
end
deactivate QS
QC --> Client : 200 OK (QuestionDto)
deactivate QC
@endum
```

### U.C 12 - Submit Answer (답변 등록 및 게이머 보상 처리)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant AC as "AnswerController"
participant AS as "AnswerService"
participant UAR as "UserAnswerRepository"
participant UR as "UserRepository"
participant QR as "QuestionRepository"

Client -> AC : POST /api/answers (AnswerRequestDto)
activate AC
AC -> AS : saveAnswer(AnswerRequestDto, currentUserId)
activate AS

AS -> QR : findById(questionId)
activate QR
QR --> AS : QuestionEntity
deactivate QR

AS -> UAR : existsByUserAndQuestion(User, Question)
activate UAR
UAR --> AS : isExists (false)
deactivate UAR

AS -> UAR : save(UserAnswerEntity)
activate UAR
UAR --> AS : savedUserAnswer
deactivate UAR

note over AS : [게이머 보상 트랜잭션]\nUser의 coin 정보 가산 (+보상)\nUser의 characterLevel 및 경험치 증가
AS -> UR : save / flush (UserEntity)

AS --> AC : AnswerResponseDto
deactivate AS
AC --> Client : 200 OK (AnswerResponseDto)
deactivate AC
@endum
```

### U.C 13 - View Answer History (답변 이력 조회)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant AC as "AnswerController"
participant AS as "AnswerService"
participant UAR as "UserAnswerRepository"

Client -> AC : GET /api/answers/my?page=0&size=10
activate AC
AC -> AS : getMyAnswers(currentUserId, Pageable)
activate AS
AS -> UAR : findByUserOrderByAnsweredAtDesc(User, Pageable)
activate UAR
UAR --> AS : Page<UserAnswer>
deactivate UAR
AS --> AC : Page<AnswerResponseDto>
deactivate AS
AC --> Client : 200 OK (Page<AnswerResponseDto>)
deactivate AC
@endum
```

---

## Module 4. 상점 및 아바타 장착 (U.C 14 ~ 15)

### U.C 14 - Purchase Item (아이템 구매)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant SC as "StoreController"
participant SS as "StoreService"
participant UR as "UserRepository"

Client -> SC : POST /api/store/purchase (PurchaseRequestDto)
activate SC
SC -> SS : purchaseItem(PurchaseRequestDto, currentUserId)
activate SS
SS -> UR : findByUserId(currentUserId)
activate UR
UR --> SS : UserEntity
deactivate UR

note over SS : 1. 코인 잔고 확인 (User.coin >= cost)\n2. 이미 소유한 아이템인지 검증

alt 코인 부족
    SS --> SC : Throw InsufficientCoinException
    SC --> Client : 400 Bad Request
else 코인 충분 및 검증 통과
    SS -> SS : User.coin 차감 (coin - cost)\nUser.purchasedItems 리스트에 아이템 코드 추가
    SS -> UR : save / flush
    SS --> SC : void (success)
    SC --> Client : 200 OK (Item purchased successfully)
end
deactivate SS
deactivate SC
@endum
```

### U.C 15 - Equip Items (아이템 장착)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant UC as "UserController"
participant US as "UserService"
participant UR as "UserRepository"

Client -> UC : PUT /api/users/me/equipped-items (EquippedItemsUpdateRequestDto)
activate UC
UC -> US : updateEquippedItems(currentUserId, EquippedItemsUpdateRequestDto)
activate US
US -> UR : findByUserId(currentUserId)
activate UR
UR --> US : UserEntity
deactivate UR

note over US : 장착 요청 아이템 코드가 소유 아이템 목록(purchasedItems)에 속하는지 검증

US -> US : User.equippedItems 변경 적용
US --> UC : void (success)
deactivate US
UC --> Client : 200 OK (Equipped items updated successfully)
deactivate UC
@endum
```

---

## Module 5. 익명 커뮤니티 및 댓글 (U.C 16 ~ 20)

### U.C 16 - View Posts (게시글 목록 및 상세 조회)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant PC as "PostController"
participant PS as "PostService"
participant PR as "PostRepository"

Client -> PC : GET /api/posts?page=0&size=10
activate PC
PC -> PS : getPosts(Pageable)
activate PS
PS -> PR : findAll(Pageable)
activate PR
PR --> PS : Page<Post>
deactivate PR
PS --> PC : Page<PostResponseDto>
deactivate PS
PC --> Client : 200 OK (Page<PostResponseDto>)
deactivate PC
@endum
```

### U.C 17 - Create Post (게시글 작성 - FastAPI 검증 연동 포함)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant PC as "PostController"
participant RT as "RestTemplate"
participant Fast as "FastAPI Filter Server"
participant PS as "PostService"
participant PR as "PostRepository"

Client -> PC : POST /api/posts (PostRequestDto)
activate PC

note over PC : [욕설 및 비하 컨텐츠 필터링 연동]\nFastAPI 서버에 게시글 제목/본문 검사 요청
PC -> RT : postForEntity(FASTAPI_URL/filter, RequestBody)
activate RT
RT -> Fast : POST /filter (contents payload)
activate Fast
Fast --> RT : FilterResponseDto (clean: true / false)
deactivate Fast
RT --> PC : ResponseEntity
deactivate RT

alt 컨텐츠가 부적절함 (clean = false)
    PC --> Client : 400 Bad Request
else 컨텐츠 정상 (clean = true)
    PC -> PS : createPost(PostEntity, currentUserId)
    activate PS
    PS -> PR : save(Post)
    activate PR
    PR --> PS : savedPost
    deactivate PR
    PS --> PC : Post
    deactivate PS
    PC --> Client : 201 Created (PostResponseDto)
end
deactivate PC
@endum
```

### U.C 18 - Edit/Delete Post (게시글 수정/삭제)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant PC as "PostController"
participant PS as "PostService"
participant PR as "PostRepository"

Client -> PC : DELETE /api/posts/{id} (Header: Bearer Token)
activate PC
PC -> PS : deletePost(postId, currentUserId)
activate PS
PS -> PR : findById(postId)
activate PR
PR --> PS : PostEntity
deactivate PR

note over PS : 게시글 작성자의 userId와 현재 요청자(currentUserId)의 소유주 권한 대조

alt 작성자 불일치
    PS --> PC : Throw UnauthorizedAccessException
    PC --> Client : 403 Forbidden
else 작성자 본인 확인 완료
    PS -> PR : delete(PostEntity)
    PS --> PC : success
    PC --> Client : 204 No Content (Deleted successfully)
end
deactivate PS
deactivate PC
@endum
```

### U.C 19 - View Comments (댓글 조회)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant CC as "CommentController"
participant CS as "CommentService"
participant CR as "CommentRepository"

Client -> CC : GET /api/posts/{postId}/comments
activate CC
CC -> CS : getCommentsByPostId(postId)
activate CS
CS -> CR : findByPostOrderByCreatedAtAsc(Post)
activate CR
CR --> CS : List<Comment>
deactivate CR
CS --> CC : List<CommentResponseDto>
deactivate CS
CC --> Client : 200 OK (List<CommentResponseDto>)
deactivate CC
@endum
```

### U.C 20 - Manage Comment (댓글 작성/수정/삭제 - FastAPI 검증 연동 포함)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant CC as "CommentController"
participant RT as "RestTemplate"
participant Fast as "FastAPI Filter Server"
participant CS as "CommentService"
participant CR as "CommentRepository"

Client -> CC : POST /api/posts/{postId}/comments (CommentRequestDto)
activate CC

note over CC : [댓글 컨텐츠 정화 필터링]\nFastAPI 서버에 댓글 본문 검사 요청
CC -> RT : postForEntity(FASTAPI_URL/filter, RequestBody)
activate RT
RT -> Fast : POST /filter (comment payload)
activate Fast
Fast --> RT : FilterResponseDto (clean: true)
deactivate Fast
RT --> CC : ResponseEntity
deactivate RT

CC -> CS : createComment(CommentEntity, currentUserId)
activate CS
CS -> CR : save(Comment)
activate CR
CR --> CS : savedComment
deactivate CR
CS --> CC : Comment
deactivate CS
CC --> Client : 201 Created (CommentResponseDto)
deactivate CC
@endum
```

---

## Module 6. AI 공감 대화 (U.C 21)

### U.C 21 - AI Empathy Chat (AI 공감 대화)
```plantuml
@startuml
autonumber
actor "React Native App" as Client
participant CC as "ChatController"
participant CS as "ChatService"
participant RT as "RestTemplate"
participant OpenAI as "OpenAI Chat API"

Client -> CC : POST /api/chat/completions (ChatCompletionRequestDto)
activate CC
CC -> CS : createCompletion(ChatCompletionRequestDto, currentUserId)
activate CS

note over CS : 1. 시스템 프롬프트(비판단적 위로, 힐링 페르소나) 주입\n2. 요청 메시지 구조화\n3. OpenAiProperties에서 API Key 로드

CS -> RT : postForEntity(OPENAI_RESPONSES_URL, HttpEntity, String.class)
activate RT

alt OpenAI API 정상 응답
    RT -> OpenAI : POST /v1/chat/completions (Header: Bearer API_KEY)
    activate OpenAI
    OpenAI --> RT : OpenAI Response Payload (JSON)
    deactivate OpenAI
    RT --> CS : ResponseEntity
    note over CS : OpenAI JSON 응답 파싱 및 답변 텍스트 추출
    CS --> CC : ChatCompletionResponseDto (reply)
    CC --> Client : 200 OK (ChatCompletionResponseDto)
else OpenAI API 타임아웃 / 장애 발생
    note over CS : timeout 또는 에러 감지
    CS --> CC : Throw ChatCompletionException(status, errorMsg)
    deactivate RT
    CC --> Client : 504 Gateway Timeout / 502 Bad Gateway
end
deactivate CS
deactivate CC
@endum
```
