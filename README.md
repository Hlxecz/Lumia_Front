# Lumia Front

Lumia의 Expo/React Native 프론트엔드 저장소입니다.  
사용자 인증, 메인 질문 화면, 기록 조회, 게시판, 프로필/설정, 상점, 채팅 화면을 포함하고 있으며 백엔드 API와 연동해 동작합니다.

## Tech Stack

- Expo SDK 54
- React 19.1
- React Native 0.81
- Expo Router
- TypeScript
- Axios

## 주요 기능

- 로그인 / 회원가입 / 토큰 기반 인증
- 오늘의 질문 조회 및 기록 화면
- 게시글 작성, 상세 조회, 댓글 기능
- 프로필 조회 및 설정 화면
- 아이템 상점 및 장착 상태 반영
- 채팅 화면
  백엔드 `/api/chat/completions` 엔드포인트를 호출합니다.

## 프로젝트 구조

```text
app/                Expo Router 화면 및 레이아웃
app/(tabs)/         탭 기반 주요 화면
components/         공용 UI 컴포넌트
context/            인증, 사용자, 음악 관련 전역 상태
constants/          API 주소, 공용 상수
assets/             이미지, 사운드, 비디오, 폰트
utils/              화면 외부로 분리한 유틸리티
```

## 시작하기

```bash
npm install
npm run start
```

캐시를 비우고 시작하려면:

```bash
npm run start -- -c
```

플랫폼별 실행:

```bash
npm run android
npm run ios
npm run web
```

정적 검사:

```bash
npm run lint
```

## 환경 변수

로컬 개발 시 `.env.local` 파일을 만들어 사용하세요.

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

- 값을 비우면 Expo 개발 서버의 현재 호스트 IP를 기준으로 API 주소를 자동 계산합니다.
- Android 에뮬레이터에서는 기본적으로 `10.0.2.2:8080`을 사용합니다.
- OpenAI 키 같은 비밀값은 프론트에 두지 마세요.

## 백엔드 연동 메모

- 기본 백엔드 포트는 `8080`입니다.
- 이 저장소에는 백엔드 코드가 포함되어 있지 않습니다.
- 채팅 기능은 프론트가 OpenAI를 직접 호출하지 않고, 백엔드 API를 거쳐야 합니다.
- 따라서 `OPENAI_API_KEY`는 백엔드 서버 환경변수에만 두는 구조가 맞습니다.

## 개발 시 참고

- Expo Go에서는 `expo-notifications`의 원격 푸시 기능이 제한됩니다.
- `expo-av`는 추후 `expo-audio`, `expo-video`로 분리 마이그레이션이 필요할 수 있습니다.
- 라우트는 파일 이름과 경로가 일치해야 하므로 `app/` 내부 파일명 변경 시 네비게이션 경로도 함께 확인하세요.

## Repository Notes

- 이 저장소는 `Lumia_Front` 프론트엔드 전용 레포지토리입니다.
- 로컬 IDE 설정 파일과 `.env.local`은 `.gitignore`로 제외되어 있습니다.
