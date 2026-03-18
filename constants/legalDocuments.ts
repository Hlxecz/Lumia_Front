import type { LegalSection } from '@/components/legal/LegalDocumentScreen';

export const privacyPolicyIntro = [
  '이 문서는 Lumia 앱이 회원가입, 로그인, 프로필 관리, 답변 기록, 상점 기능, 알림 설정을 제공하는 과정에서 어떤 정보를 처리하는지 설명합니다.',
  '현재 앱 클라이언트 기준으로 확인되는 기능을 바탕으로 작성한 초안이며, 실제 운영 환경의 서버 로그 보관, 위탁사, 문의처 정보는 배포 전에 운영 정책과 일치하도록 최종 검토해야 합니다.',
];

export const privacyPolicySections: LegalSection[] = [
  {
    title: '1. 수집하는 정보',
    body: [
      '계정 및 인증 정보: 로그인 ID, 비밀번호, 이메일 주소, 인증 토큰 및 리프레시 토큰.',
      '프로필 정보: 닉네임, 성별, 혈액형, MBTI와 같이 사용자가 직접 입력하거나 수정하는 정보.',
      '서비스 이용 정보: 질문 응답 내용, 게시글과 댓글, 보유 코인, 구매한 아이템, 장착 중인 아이템, 캐릭터 성장 단계.',
      '기기 및 설정 정보: 알림 허용 여부, 알림 시간, 음악 설정, 앱 버전, 로컬 저장소에 보관되는 일부 환경 설정.',
    ],
  },
  {
    title: '2. 이용 목적',
    body: [
      '회원 식별, 로그인 유지, 보안 검증 및 계정 보호.',
      '프로필 표시, 감정 기록, 질문/답변 제공, 게시판 및 상점 기능 운영.',
      '사용자가 요청한 알림 예약, 환경 설정 저장, 서비스 품질 개선을 위한 오류 확인.',
    ],
  },
  {
    title: '3. 보관 및 파기',
    body: [
      '계정 정보와 서비스 데이터는 원칙적으로 회원 탈퇴 또는 처리 목적 달성 시까지 보관합니다.',
      '법령상 보관 의무가 있는 정보는 해당 기간 동안 별도로 보관할 수 있습니다.',
      '앱 클라이언트에 저장된 토큰과 일부 설정값은 로그아웃, 앱 삭제 또는 재설치 시 제거될 수 있습니다.',
    ],
  },
  {
    title: '4. 제3자 제공 및 외부 서비스',
    body: [
      '앱 클라이언트 코드 기준으로 광고 목적의 제3자 제공 또는 외부 분석 SDK는 확인되지 않았습니다.',
      '알림 기능은 기기 운영체제와 Expo 기반 라이브러리를 사용할 수 있으며, 실제 서버/인프라 운영 방식이 추가되면 관련 내용을 본 방침에 반영해야 합니다.',
    ],
  },
  {
    title: '5. 이용자의 권리',
    body: [
      '사용자는 자신의 프로필 정보를 조회, 수정할 수 있고 계정 삭제를 요청할 수 있습니다.',
      '개인정보 처리에 대한 문의, 정정, 삭제, 처리정지 요청은 서비스 운영자가 제공하는 지원 채널을 통해 접수할 수 있어야 합니다.',
    ],
  },
  {
    title: '6. 보호 조치',
    body: [
      '클라이언트는 인증 토큰을 Secure Store에 저장하고, 서버 통신 시 인증 헤더를 사용합니다.',
      '운영자는 접근 통제, 전송 구간 보호, 최소 권한 원칙, 비밀번호 보호 조치를 포함한 합리적인 보안 대책을 유지해야 합니다.',
    ],
  },
  {
    title: '7. 변경 및 문의',
    body: [
      '방침이 변경되면 앱 내 공지 또는 업데이트를 통해 변경 사항과 시행일을 안내합니다.',
      '배포 전에는 실제 운영자명, 문의 이메일, 개인정보 보호 책임자 또는 연락 채널을 본 문서에 추가해야 합니다.',
    ],
  },
];

export const privacyPolicyFooter = [
  '정책 작성 참고: 개인정보보호위원회 개인정보 처리방침 공개 기준 및 일반적인 모바일 서비스 운영 관행.',
];

export const termsOfUseIntro = [
  '이 문서는 Lumia 앱의 계정, 커뮤니티, 기록, 상점, 알림 기능을 이용할 때 적용되는 기본 이용 조건을 정리한 초안입니다.',
  '운영 방식, 유료 정책, 환불 정책, 관할 및 분쟁 조항은 실제 서비스 정책에 맞게 배포 전에 최종 확정해야 합니다.',
];

export const termsOfUseSections: LegalSection[] = [
  {
    title: '1. 서비스의 목적',
    body: [
      'Lumia는 사용자의 감정 기록, 질문 답변, 커뮤니티 활동, 프로필 관리 및 캐릭터 성장 경험을 제공하는 모바일 서비스입니다.',
    ],
  },
  {
    title: '2. 계정 및 이용자 책임',
    body: [
      '사용자는 정확한 계정 정보를 제공하고 자신의 로그인 정보와 기기 접근 권한을 안전하게 관리해야 합니다.',
      '타인의 계정을 도용하거나 비정상적인 방법으로 인증을 우회해서는 안 됩니다.',
    ],
  },
  {
    title: '3. 이용 제한 행위',
    body: [
      '불법 정보 게시, 타인 권리 침해, 혐오/괴롭힘, 서비스 운영 방해, 자동화된 비정상 요청, 취약점 악용은 금지됩니다.',
      '운영자는 위반 행위가 확인되면 게시물 제한, 기능 제한, 계정 정지 또는 삭제 조치를 할 수 있습니다.',
    ],
  },
  {
    title: '4. 게시물과 기록의 처리',
    body: [
      '질문 답변, 게시글, 댓글 등 사용자가 입력한 콘텐츠의 책임은 원칙적으로 작성자에게 있습니다.',
      '운영자는 법령 위반, 신고 접수, 서비스 운영상 필요가 있는 경우 관련 콘텐츠를 검토하거나 제한할 수 있습니다.',
    ],
  },
  {
    title: '5. 상점, 코인, 아이템',
    body: [
      '앱 내 코인과 아이템은 서비스 내 기능 제공을 위한 데이터이며, 현금성 자산이나 재산권으로 해석되지 않습니다.',
      '운영자는 서비스 밸런스, 정책 변경, 기술적 필요에 따라 아이템 구성이나 지급 방식, 성장 구조를 조정할 수 있습니다.',
    ],
  },
  {
    title: '6. 서비스 변경 및 중단',
    body: [
      '운영자는 점검, 보안, 정책 변경, 기술적 사유로 서비스 일부를 수정하거나 중단할 수 있습니다.',
      '중대한 변경이 있는 경우 합리적인 범위에서 사전 공지하거나 사후 안내를 제공합니다.',
    ],
  },
  {
    title: '7. 책임의 제한',
    body: [
      '운영자는 천재지변, 통신 장애, 기기 문제, 이용자의 귀책 사유로 발생한 손해에 대해 법령상 허용되는 범위에서 책임을 제한할 수 있습니다.',
      '다만 고의 또는 중대한 과실이 있는 경우에는 관련 법령에 따릅니다.',
    ],
  },
  {
    title: '8. 약관의 변경',
    body: [
      '약관이 변경되면 시행일과 주요 변경 내용을 앱 내 공지, 업데이트 노트 또는 별도 안내 화면을 통해 제공합니다.',
    ],
  },
];

export const termsOfUseFooter = [
  '정식 배포 전에는 운영자 정보, 유료 결제 조건, 환불/청약철회 정책, 분쟁 해결 절차를 실제 서비스 정책과 일치하게 보완해야 합니다.',
];

export interface OpenSourcePackage {
  name: string;
  version: string;
  license: string;
  homepage: string;
}

export const openSourceIntro = [
  'Lumia는 여러 오픈소스 소프트웨어를 기반으로 제작되었습니다.',
  '아래 목록은 현재 앱 클라이언트의 직접 의존성 기준으로 정리한 고지이며, 각 패키지의 세부 저작권 및 라이선스 전문은 해당 패키지 배포물과 원저작자 고지를 따릅니다.',
];

export const openSourcePackages: OpenSourcePackage[] = [
  { name: '@expo/vector-icons', version: '15.1.1', license: 'MIT', homepage: 'https://expo.github.io/vector-icons' },
  { name: '@react-native-async-storage/async-storage', version: '2.2.0', license: 'MIT', homepage: 'https://github.com/react-native-async-storage/async-storage#readme' },
  { name: '@react-native-community/datetimepicker', version: '8.4.4', license: 'MIT', homepage: 'https://github.com/react-native-community/datetimepicker#readme' },
  { name: '@react-native-picker/picker', version: '2.11.1', license: 'MIT', homepage: 'https://github.com/react-native-picker/picker#readme' },
  { name: '@react-navigation/bottom-tabs', version: '7.15.5', license: 'MIT', homepage: 'https://github.com/react-navigation/react-navigation.git' },
  { name: '@react-navigation/elements', version: '2.9.10', license: 'MIT', homepage: 'https://reactnavigation.org' },
  { name: '@react-navigation/native', version: '7.1.33', license: 'MIT', homepage: 'https://reactnavigation.org' },
  { name: 'axios', version: '1.9.0', license: 'MIT', homepage: 'https://axios-http.com' },
  { name: 'expo', version: '54.0.33', license: 'MIT', homepage: 'https://github.com/expo/expo/tree/main/packages/expo' },
  { name: 'expo-av', version: '16.0.8', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/av/' },
  { name: 'expo-blur', version: '15.0.8', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/blur-view/' },
  { name: 'expo-constants', version: '18.0.13', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/constants/' },
  { name: 'expo-font', version: '14.0.11', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/font/' },
  { name: 'expo-haptics', version: '15.0.8', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/haptics/' },
  { name: 'expo-image', version: '3.0.11', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/image/' },
  { name: 'expo-linking', version: '8.0.11', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/linking' },
  { name: 'expo-notifications', version: '0.32.16', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/notifications/' },
  { name: 'expo-router', version: '6.0.23', license: 'MIT', homepage: 'https://docs.expo.dev/routing/introduction/' },
  { name: 'expo-secure-store', version: '15.0.8', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/securestore/' },
  { name: 'expo-splash-screen', version: '31.0.13', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/splash-screen/' },
  { name: 'expo-status-bar', version: '3.0.9', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/status-bar/' },
  { name: 'expo-symbols', version: '1.0.8', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/symbols/' },
  { name: 'expo-system-ui', version: '6.0.9', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/system-ui' },
  { name: 'expo-web-browser', version: '15.0.10', license: 'MIT', homepage: 'https://docs.expo.dev/versions/latest/sdk/webbrowser/' },
  { name: 'react', version: '19.1.0', license: 'MIT', homepage: 'https://react.dev/' },
  { name: 'react-dom', version: '19.1.0', license: 'MIT', homepage: 'https://react.dev/' },
  { name: 'react-native', version: '0.81.5', license: 'MIT', homepage: 'https://reactnative.dev/' },
  { name: 'react-native-gesture-handler', version: '2.28.0', license: 'MIT', homepage: 'https://github.com/software-mansion/react-native-gesture-handler#readme' },
  { name: 'react-native-modal', version: '14.0.0-rc.1', license: 'MIT', homepage: 'https://github.com/react-native-modal/react-native-modal' },
  { name: 'react-native-picker-select', version: '9.3.1', license: 'MIT', homepage: 'https://github.com/lawnstarter/react-native-picker-select.git' },
  { name: 'react-native-reanimated', version: '4.1.6', license: 'MIT', homepage: 'https://docs.swmansion.com/react-native-reanimated' },
  { name: 'react-native-safe-area-context', version: '5.6.2', license: 'MIT', homepage: 'https://github.com/AppAndFlow/react-native-safe-area-context#readme' },
  { name: 'react-native-screens', version: '4.16.0', license: 'MIT', homepage: 'https://github.com/software-mansion/react-native-screens#readme' },
  { name: 'react-native-web', version: '0.21.2', license: 'MIT', homepage: 'git://github.com/necolas/react-native-web.git' },
  { name: 'react-native-webview', version: '13.15.0', license: 'MIT', homepage: 'https://github.com/react-native-webview/react-native-webview#readme' },
  { name: 'react-native-worklets', version: '0.5.1', license: 'MIT', homepage: 'https://docs.swmansion.com/react-native-worklets' },
];

export const openSourceFooter = [
  '현재 직접 의존성 36개는 모두 MIT 라이선스로 표시되어 있습니다.',
  '전이 의존성과 개별 저작권 고지는 패키지별 LICENSE 파일과 배포본 고지를 함께 확인해야 합니다.',
];
