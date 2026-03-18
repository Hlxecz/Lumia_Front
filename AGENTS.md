# Repository Guidelines

## 프로젝트 구조 및 모듈 구성
`app/`에는 Expo Router 기반 화면과 레이아웃이 들어갑니다. 파일 이름은 라우트와 일치하게 유지하세요. 탭 화면은 `app/(tabs)/`, 동적 화면은 `app/boardDetail/[id].tsx` 같은 파라미터 폴더를 사용합니다. 공용 UI는 `components/`, 전역 상태와 Provider는 `context/`, 재사용 훅은 `hooks/`, API 및 상수는 `constants/`에 둡니다. 정적 리소스는 `assets/images`, `assets/sounds`, `assets/videos`, `assets/fonts`에 저장합니다. `scripts/reset-project.js`는 일반 개발용이 아니라 초기 스캐폴드 리셋용 스크립트입니다.

## 빌드, 테스트 및 개발 명령어
- `npm install`: `package-lock.json` 기준으로 의존성을 설치합니다.
- `npm run start`: Expo 개발 서버를 실행합니다.
- `npm run android`: Android 환경에서 앱을 실행합니다.
- `npm run ios`: iOS 환경에서 앱을 실행합니다.
- `npm run web`: 웹 대상으로 로컬 실행합니다.
- `npm run lint`: Expo ESLint 설정으로 정적 검사를 수행합니다. PR 전 반드시 실행하세요.
- `npm run reset-project`: 현재 앱 스캐폴드를 교체합니다. 의도적으로만 실행하세요.

## 코딩 스타일 및 네이밍 규칙
TypeScript `strict` 모드를 사용하며, 내부 모듈 import에는 `@/` 별칭을 우선 사용합니다. 기존 코드 스타일을 따르세요. 기본은 2칸 들여쓰기, 세미콜론 사용, 함수형 React 컴포넌트입니다. 컴포넌트와 Context Provider는 `PascalCase`, 훅/헬퍼/로컬 변수는 `camelCase`를 사용합니다. 라우트 파일 이름은 화면 경로와 맞춰 `login.tsx`, `[id].tsx`처럼 작성하세요. URL이나 키 값 같은 공용 상수는 화면 파일에 흩뿌리지 말고 `constants/`에 모아두세요.

## 테스트 가이드라인
현재 저장소에는 자동화 테스트 스위트가 포함되어 있지 않습니다. 당분간 `npm run lint`를 최소 검증 단계로 삼고, 변경한 기능은 Expo Go 또는 에뮬레이터에서 직접 확인하세요. 특히 인증, 탭 이동, 게시글 상세/수정 라우트, 미디어 재생, 알림 관련 흐름을 우선 점검해야 합니다. 추후 테스트를 추가할 때는 기능 파일 옆이나 전용 `__tests__/` 폴더에 두고, 파일 이름은 `*.test.ts(x)` 형식을 사용하세요.

## 커밋 및 Pull Request 가이드라인
최근 커밋 이력에는 `CC`, `commit`, `cc`처럼 짧고 일관되지 않은 메시지가 섞여 있어 유지할 만한 규칙이 보이지 않습니다. 앞으로는 `Add token refresh guard`, `Fix board edit redirect`처럼 짧은 명령형 메시지를 사용하세요. PR에는 변경 요약, 연결된 이슈 또는 작업 번호, UI 변경 시 스크린샷이나 녹화본, 그리고 수행한 수동 검증 내용(`android`, `web`, `lint` 등)을 포함해야 합니다.

## 보안 및 설정 팁
`constants/api.ts`에는 현재 로컬 API base URL이 하드코딩되어 있습니다. 환경별 엔드포인트나 비밀값을 기능 코드에 직접 커밋하지 마세요. 설정 변경은 한곳에 모아 관리하고, 로컬 실행에 필요한 설정이 있다면 PR 설명에 함께 남기세요.
