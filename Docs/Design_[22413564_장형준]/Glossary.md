# 6. Glossary

[⬅️ Back to Contents](./Design.md)

---

### 📌 주요 어노테이션 (Annotations)

<table align="center" width="100%">
  <thead bgcolor="#f2f2f2">
    <tr align="center">
      <th width="30%">어노테이션 (Annotation)</th>
      <th width="70%">상세 설명 (Description)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>@RestController</b></td>
      <td>RESTful 웹 서비스의 컨트롤러임을 선언합니다. <code>@Controller</code>와 <code>@ResponseBody</code>의 역할을 겸하여 모든 반환 객체를 JSON 형태로 직렬화합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@RequestMapping</b></td>
      <td>특정 HTTP URL 경로와 컨트롤러 클래스 혹은 메서드를 매핑하기 위해 지정합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@RequiredArgsConstructor</b></td>
      <td>Lombok에서 제공하며, <code>final</code> 필드 또는 <code>@NonNull</code> 필드를 매개변수로 취하는 생성자를 자동으로 빌드하여 Spring의 생성자 의존성 주입을 돕습니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Service</b></td>
      <td>해당 클래스가 비즈니스 로직 계층임을 선언하며, Spring Application Context에 빈(Bean)으로 등록되도록 합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Transactional</b></td>
      <td>메서드나 클래스에 선언하여 데이터베이스 작업 단위를 트랜잭션으로 묶어 성공 시 커밋, 실패 시 자동 롤백을 통제합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Entity</b></td>
      <td>클래스를 데이터베이스 테이블과 매핑시킬 JPA 영속성 도메인 엔티티 객체로 지정합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Table</b></td>
      <td>엔티티에 매핑할 실제 DB의 물리 테이블 명칭을 설정합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@MappedSuperclass</b></td>
      <td>여러 엔티티가 공통으로 소유하는 매핑 속성(예: 생성/수정일시)을 부모 추상 클래스에 정의하고 상속받을 수 있도록 지정합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Configuration</b></td>
      <td>클래스 내부에서 하나 이상의 <code>@Bean</code> 메서드를 정의하여 Spring IoC 컨테이너 설정용 클래스임을 나타냅니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@EnableWebSecurity</b></td>
      <td>Spring Security 설정을 활성화하고 웹 보안 필터 체인을 구성할 수 있는 기반을 마련합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Component</b></td>
      <td>Spring에서 관리할 일반적인 컴포넌트 빈(Bean)으로 자동 검색 및 스캔 대상으로 설정합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@ConfigurationProperties</b></td>
      <td>설정 파일(<code>application.yml</code> 등)에 등록된 특정 접두사의 키-값 정보를 Java 빈 프로퍼티 필드에 구조화하여 매핑합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Getter / @Setter</b></td>
      <td>Lombok 라이브러리를 사용해 컴파일 시 필드별 Get/Set 메서드를 수동 코딩 없이 자동으로 삽입합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>@Builder</b></td>
      <td>Lombok 라이브러리를 기반으로 안전하고 유연한 객체 생성을 가능하게 하는 빌더 패턴을 자동 구현합니다.</td>
    </tr>
  </tbody>
</table>

---

### 📌 설계/기술 관련 핵심 용어 (Technical Terms)

<table align="center" width="100%">
  <thead bgcolor="#f2f2f2">
    <tr align="center">
      <th width="30%">기술 용어 (Term)</th>
      <th width="70%">상세 설명 (Description)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>JWT (JSON Web Token)</b></td>
      <td>인증에 필요한 정보들을 서명된 JSON 객체 포맷으로 압축하여 안전하게 전송하는 자가 수용적 토큰입니다.</td>
    </tr>
    <tr>
      <td align="center"><b>Access / Refresh Token</b></td>
      <td>Access Token은 실제 서비스 권한 확인에 쓰이는 유효 수명이 짧은 토큰이며, Refresh Token은 Access Token 재발급만을 위한 장기 보관용 갱신 권한 인증 증명입니다.</td>
    </tr>
    <tr>
      <td align="center"><b>CORS (Cross-Origin Resource Sharing)</b></td>
      <td>웹 브라우저 상에서 실행 중인 스크립트가 리소스가 업로드된 도메인이 아닌 다른 도메인의 자원에 접근할 수 있도록 보안 허용 규칙을 선언하는 표준 정책입니다.</td>
    </tr>
    <tr>
      <td align="center"><b>JPA (Java Persistence API)</b></td>
      <td>자바 진영에서 사용하는 표준 객체-관계 매핑(ORM) 명세서로, SQL 작성을 자동화하고 엔티티와 테이블을 직접 동기화합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>Auditing (오디팅)</b></td>
      <td>엔티티가 생성 및 변경될 때 생성자나 변경일시 등의 메타 데이터를 JPA 엔진이 가로채 자동으로 테이블에 주입해주는 추적 모니터링 기능입니다.</td>
    </tr>
    <tr>
      <td align="center"><b>OpenAI Completion API</b></td>
      <td>시스템 프롬프트 지시어와 사용자의 채팅 기록을 주입받아 대규모 언어모델(LLM) 기반의 공감 위로 답변을 완성해 전달해주는 인터페이스입니다.</td>
    </tr>
    <tr>
      <td align="center"><b>RestTemplate</b></td>
      <td>Spring 환경에서 동기식 네트워크 통신을 통해 외부 REST API 엔드포인트(OpenAI, FastAPI 등)에 간편히 호출을 날릴 수 있게 지원하는 프론트 클라이언트 템플릿입니다.</td>
    </tr>
    <tr>
      <td align="center"><b>Security Filter Chain</b></td>
      <td>인증 및 인가 통제를 처리하기 위해 특정 필터들을 직렬 사슬 형태로 구성하여 요청이 통과하거나 걸러지도록 처리하는 스프링 보안 장치 구조입니다.</td>
    </tr>
    <tr>
      <td align="center"><b>Native Query (네이티브 쿼리)</b></td>
      <td>데이터베이스 관리 시스템(DBMS) 고유의 SQL 문장을 소스코드에 그대로 작성하여 실행하는 방법으로, JPA 표준 JPQL로 대체할 수 없는 복잡한 구문(예: 무작위 질문 행 추출)에 주로 도입합니다.</td>
    </tr>
    <tr>
      <td align="center"><b>Pageable / Page</b></td>
      <td>페이징을 요구하는 대량 데이터 처리 시 요청을 위한 인자 정보(조회 페이지, 크기, 정렬 기준)와 그 조회 결과를 목록화해 감싸는 Spring Data JPA 제공 컨테이너 구조입니다.</td>
    </tr>
  </tbody>
</table>

---

**[Next Step: 7. References](./References.md)**
