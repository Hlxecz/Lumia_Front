# 5. Implementation Requirements

[Back to Contents](./Design.md)

---

이 문서는 Lumia 시스템의 구현 및 구동을 위한 하드웨어 요구 사양(Hardware Requirements)과 소프트웨어 환경 및 세부 기술 스펙(Software & Technical Specification)을 정리한 문서입니다.

---

## 1. 하드웨어 요구 사양 (Hardware Requirements)

시스템 빌드 및 구동을 위해 요구되는 기준 하드웨어 사양 및 실제 검증 환경 정보입니다.

### 1-1. 개발 및 빌드 환경 요구 사양 (Dev PC & Build Machine)
> [!NOTE]
> 단순히 컴파일된 백엔드 서버나 클라이언트 앱을 단독 실행(Runtime)하는 것은 인텔 i3급 이하(듀얼코어 프로세서)에서도 무리 없이 구동 가능합니다. 단, 개발 단계에서 **IDE(개발 도구), 모바일 기기 에뮬레이터, Spring Boot API 서버, FastAPI 필터 서버 등을 로컬에서 동시에 실행**하는 쾌적한 개발 멀티태스킹 환경을 기준으로 작성된 사양입니다.

| 구분 | 최소 요구 사양 | 권장 사양 |
| :--- | :--- | :--- |
| **CPU (Intel)** | Intel Core i3 8세대 이상 (예: i3-8100 / i5-8400) | Intel Core i5 10세대 / i7 12세대 이상 |
| **CPU (AMD)** | AMD Ryzen 3 2000 시리즈 이상 (예: Ryzen 3 2200G / Ryzen 5 2600) | AMD Ryzen 5 3600 / Ryzen 7 5000 이상 |
| **메모리 (RAM)** | 8 GB 이상 | 16 GB 이상 |
| **저장 공간 (Storage)** | 20 GB 이상의 여유 공간 | 50 GB 이상의 SSD 여유 공간 |

### 1-2. 대상 모바일 기기 호환 사양 (Mobile Device Compatibility)
Lumia 클라이언트 애플리케이션(React Native)은 안드로이드(삼성 갤럭시) 및 iOS(아이폰) 기기들과 아래 사양 기준으로 완벽하게 호환됩니다.

| 구분 | 최소 지원 사양 (호환 가능) | 권장 지원 사양 |
| :--- | :--- | :--- |
| **삼성 갤럭시 (Galaxy)** | Galaxy S9 / Note 9 이상 (Android 8.0 Oreo 이상) | Galaxy S20 / Note 20 이상 (Android 11.0 이상) |
| **애플 아이폰 (iPhone)** | iPhone 8 / iPhone X 이상 (iOS 13.0 이상) | iPhone 12 이상 (iOS 15.0 이상) |
| **기타 모바일 기기** | RAM 2 GB 이상, 해상도 HD(1280x720) 이상 | RAM 4 GB 이상, FHD 해상도 이상 |

### 1-3. 개발 및 검증 환경 사양 (Test Verification Environment)
| 구분 | 실제 검증 기기 사양 | 비고 |
| :--- | :--- | :--- |
| **CPU** | 13th Gen Intel(R) Core(TM) i7-13650HX | 13세대 고성능 인텔 코어 프로세서 |
| **메모리 (RAM)** | 24 GB | 로컬 빌드 및 에뮬레이터 구동 안정성 검증 완료 |
| **운영체제 (OS)** | Microsoft Windows (x64) | - |

---

## 2. 소프트웨어 및 기술 스펙 (Software & Technical Specification)

### 2-1. 클라이언트 구현 환경 (Client Environment)
| 구분 | 개발 및 실행 요구 사양 | 비고 |
| :--- | :--- | :--- |
| **개발 언어** | TypeScript, JavaScript (ES6+) | - |
| **프레임워크** | React Native, Expo SDK 50+ | 하이브리드 모바일 앱 빌드용 |
| **라우팅 라이브러리** | Expo Router | 파일 기반 앱 내비게이션 관리 |
| **개발 도구 (IDE)** | VS Code, Android Studio, Xcode | 에뮬레이터 및 시뮬레이터 포함 |
| **대상 모바일 OS** | Android 8.0 (Oreo) 이상, iOS 13.0 이상 | 실기기 및 에뮬레이터 지원 환경 |
| **패키지 관리자** | npm 10.x 이상 / Node.js LTS v20.x 이상 | package-lock.json 기반 의존성 설치 |

### 2-2. 백엔드 서버 구현 환경 및 기술 스펙 (Server Environment & Technical Spec)
| 구분 | 요구 사양 및 구현 기술 스펙 | 비고 |
| :--- | :--- | :--- |
| **개발 언어** | Java 17 | JDK 17 LTS 버전 기준 |
| **프레임워크** | Spring Boot 3.4.x | REST API 기반 웹 애플리케이션 구축 |
| **아키텍처 패턴** | 5계층 분리 구조 (Controller, Service, Repository, Entity, DTO) | 계층 간 책임 분리 및 의존성 최소화 |
| **API 디자인** | `/api/...` 경로 기반 REST API 설계 | 모든 주요 서버 기능은 REST API로 제공 |
| **데이터베이스** | MySQL 8.0 이상 / H2 (로컬 테스트용) | 데이터 영속성 관리 및 데이터 저장소 구성 |
| **ORM 기술** | JPA Entity 및 Spring Data JPA Repository | 객체-관계형 매핑 및 DB 연동 처리 |
| **감사 기능 (Auditing)** | JPA Auditing 적용 | 생성일/수정일(CreatedDate, LastModifiedDate) 자동 등록 |
| **인증 및 보안** | Spring Security | 인증 필터 설정, CORS 정책 구성, 패스워드 암호화 |
| **토큰 인증 (Auth)** | JWT 기반 Access Token & Refresh Token 발급 | 로그인 성공 시 토큰 발급, Refresh Token은 DB 적재/검증/재발급 |
| **접근 제어 (AuthZ)** | 인증 기반 접근 제어 | 게시글/댓글/사용자 정보 수정 등 데이터 변경은 인가된 사용자만 허용 |
| **데이터 노출 제어** | Entity 직접 노출 금지 및 API DTO 사용 | API 요청 및 응답 시 데이터 노출 제한 |

### 2-3. 외부 API 및 인프라 연동 환경 (External API & Infrastructure)
| 구분 | 개발 및 실행 요구 사양 | 비고 |
| :--- | :--- | :--- |
| **텍스트 검열 서버** | FastAPI 0.100.x+ (Python 3.10+) | 비속어 및 욕설 차단 필터링 전용 서버 |
| **인공지능 대화 API** | OpenAI API (gpt-3.5-turbo / gpt-4o) | AI 고양이 상담 챗봇 실시간 연동 |
| **알림 서비스 (FCM)** | Expo Push Notification Service | 알림 시간 스케줄 매칭 기기 푸시 발송 |
| **서버 호스팅 환경** | AWS (EC2 / RDS) / 로컬 호스트 구동 | 프로덕션 배포 및 개발 서버 운영 |
