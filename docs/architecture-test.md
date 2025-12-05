# 아키텍처 테스트 가이드 (dependency-cruiser)

이 프로젝트는 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)를 사용하여 계층 간 의존성 규칙을 검증합니다. Java의 ArchUnit과 유사한 역할을 합니다.

## 목차

- [실행 방법](#실행-방법)
- [동작 원리](#동작-원리)
- [설정 파일 구조](#설정-파일-구조)
- [규칙 작성법](#규칙-작성법)
- [CLI 명령어](#cli-명령어)
- [출력 포맷](#출력-포맷)
- [프로젝트 규칙](#프로젝트-규칙)

---

## 실행 방법

```bash
# 아키텍처 규칙 검사
bun run arch:test

# 의존성 그래프 생성 (graphviz 필요: brew install graphviz)
bun run arch:graph
```

**실행 결과 예시:**

```bash
# 위반 없음
✔ no dependency violations found (25 modules, 57 dependencies cruised)

# 위반 있음 (exit code 1)
error domain-not-depend-on-adapter: src/domain/member/member.ts → src/adapter/persistence/repo.ts
✖ 1 dependency violations (1 errors, 0 warnings). 25 modules, 57 dependencies cruised.
```

---

## 동작 원리

dependency-cruiser는 다음 과정으로 동작합니다:

```
1. 소스 파일 파싱
   └─ TypeScript/JavaScript AST 분석
   └─ import/require 문 추출

2. 의존성 그래프 생성
   └─ 모듈 간 관계 매핑
   └─ 순환 참조 감지

3. 규칙 검사
   └─ forbidden 규칙과 대조
   └─ 위반 사항 수집

4. 결과 출력
   └─ 텍스트, JSON, DOT 등 다양한 포맷
```

### Java ArchUnit과의 비교

| ArchUnit (Java) | dependency-cruiser (JS/TS) |
|-----------------|---------------------------|
| `@AnalyzeClasses(packages = "...")` | `includeOnly: ['^src/']` |
| `noClasses().that().resideInAPackage("..domain..")` | `from: { path: '^src/domain/' }` |
| `.should().dependOnClassesThat().resideInAPackage("..adapter..")` | `to: { path: '^src/adapter/' }` |
| JUnit 테스트로 실행 | CLI 또는 npm script로 실행 |

---

## 설정 파일 구조

설정 파일: `.dependency-cruiser.cjs`

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  // 금지된 의존성 규칙 배열
  forbidden: [
    { /* 규칙 1 */ },
    { /* 규칙 2 */ },
  ],

  // 옵션
  options: {
    doNotFollow: { path: ['node_modules'] },  // 제외할 경로
    includeOnly: ['^src/'],                    // 분석 대상
    tsPreCompilationDeps: true,                // 타입 의존성 포함
    tsConfig: { fileName: 'tsconfig.json' },   // TS 설정 파일
    reporterOptions: { /* 출력 옵션 */ },
  },
};
```

---

## 규칙 작성법

### 기본 구조

```javascript
{
  name: 'rule-name',           // 규칙 식별자 (필수)
  comment: '설명',              // 위반 시 표시되는 메시지
  severity: 'error',           // 'error' | 'warn' | 'info' | 'ignore'
  from: { /* 출발지 조건 */ },  // 의존하는 쪽
  to: { /* 도착지 조건 */ },    // 의존되는 쪽
}
```

### from/to 조건

```javascript
// 경로 매칭 (정규표현식)
from: { path: '^src/domain/' }           // domain 폴더 내 모든 파일
from: { path: '^src/domain/member/' }    // 특정 하위 폴더
from: { pathNot: '\\.spec\\.ts$' }       // 테스트 파일 제외

// 복합 조건
from: {
  path: '^src/application/',
  pathNot: '\\.module\\.ts$',  // module 파일 제외
}

// 도착지 조건
to: { path: '^src/adapter/' }
to: { circular: true }         // 순환 의존성
to: { orphan: true }           // 고아 파일 (아무도 참조 안 함)
to: { couldNotResolve: true }  // 해결 불가능한 import
```

### 실전 예시

**1. 계층 간 의존성 금지**

```javascript
// Domain → Adapter 금지
{
  name: 'domain-not-depend-on-adapter',
  severity: 'error',
  from: { path: '^src/domain/' },
  to: { path: '^src/adapter/' },
}
```

**2. 순환 의존성 금지**

```javascript
{
  name: 'no-circular',
  severity: 'error',
  from: {},  // 모든 파일
  to: { circular: true },
}
```

**3. 특정 파일 예외 처리**

```javascript
// Application → Adapter 금지, 단 *.module.ts는 예외
{
  name: 'application-not-depend-on-adapter',
  severity: 'error',
  from: {
    path: '^src/application/',
    pathNot: '\\.module\\.ts$',  // NestJS Module은 예외
  },
  to: { path: '^src/adapter/' },
}
```

**4. 특정 라이브러리 사용 금지**

```javascript
// moment.js 대신 date-fns 사용 강제
{
  name: 'no-moment',
  comment: 'moment.js 대신 date-fns를 사용하세요',
  severity: 'error',
  from: {},
  to: { path: 'node_modules/moment' },
}
```

**5. 테스트 파일에서만 특정 모듈 허용**

```javascript
// 프로덕션 코드에서 test-utils 참조 금지
{
  name: 'no-test-utils-in-prod',
  severity: 'error',
  from: { pathNot: '\\.spec\\.ts$' },  // 테스트 파일 아닌 곳
  to: { path: 'test-utils' },
}
```

---

## CLI 명령어

### 기본 실행

```bash
# 설정 파일로 검사
npx depcruise src --config .dependency-cruiser.cjs

# 설정 파일 없이 기본 검사
npx depcruise src

# 특정 파일만 검사
npx depcruise src/domain
```

### 출력 포맷 지정

```bash
# 텍스트 (기본)
npx depcruise src --config .dependency-cruiser.cjs

# JSON
npx depcruise src --config .dependency-cruiser.cjs --output-type json > result.json

# DOT (Graphviz)
npx depcruise src --config .dependency-cruiser.cjs --output-type dot > graph.dot

# DOT → SVG (파이프라인)
npx depcruise src --config .dependency-cruiser.cjs --output-type dot | dot -Tsvg > graph.svg

# HTML 리포트
npx depcruise src --config .dependency-cruiser.cjs --output-type html > report.html

# Mermaid
npx depcruise src --config .dependency-cruiser.cjs --output-type mermaid > graph.mmd
```

### 필터링

```bash
# 특정 경로만 포함
npx depcruise src --include-only "^src/domain"

# 특정 경로 제외
npx depcruise src --do-not-follow "node_modules"

# 최대 깊이 제한
npx depcruise src --max-depth 3
```

### 유용한 옵션

```bash
# 위반만 출력
npx depcruise src --config .dependency-cruiser.cjs --output-type err

# 위반 개수만 출력
npx depcruise src --config .dependency-cruiser.cjs --output-type err-long

# 진행 상황 표시
npx depcruise src --config .dependency-cruiser.cjs --progress

# 초기 설정 파일 생성
npx depcruise --init
```

---

## 출력 포맷

### 텍스트 (기본)

```
error domain-not-depend-on-adapter: src/domain/member/member.ts → src/adapter/persistence/repo.ts
warn  no-circular: src/a.ts → src/b.ts → src/a.ts

✖ 2 dependency violations (1 errors, 1 warnings). 25 modules, 57 dependencies cruised.
```

### JSON

```json
{
  "modules": [...],
  "summary": {
    "violations": [...],
    "error": 1,
    "warn": 1,
    "info": 0,
    "totalCruised": 25,
    "totalDependenciesCruised": 57
  }
}
```

### DOT → SVG 그래프

```bash
bun run arch:graph
# dependency-graph.svg 생성
```

그래프에서:
- **빨간색 노드**: Domain 계층
- **초록색 노드**: Application 계층
- **파란색 노드**: Adapter 계층
- **빨간 화살표**: 규칙 위반

---

## 프로젝트 규칙

### 계층 구조

```
src/
├── domain/          # 핵심 비즈니스 로직 (가장 안쪽)
├── application/     # 유스케이스, 서비스 (중간)
└── adapter/         # 외부 세계와의 연결 (가장 바깥)
    ├── webapi/      # REST API 컨트롤러
    ├── persistence/ # 데이터베이스 (TypeORM)
    ├── integration/ # 외부 서비스 (Email 등)
    └── security/    # 보안 관련 (암호화 등)
```

### 의존성 규칙

```
허용: adapter → application → domain
금지: domain → application, adapter
금지: application → adapter (*.module.ts 제외)
```

### 현재 설정된 규칙

| 규칙 | 심각도 | 설명 |
|------|--------|------|
| `application-not-depend-on-adapter` | error | Application → Adapter 금지 (Module 예외) |
| `domain-not-depend-on-application` | error | Domain → Application 금지 |
| `domain-not-depend-on-adapter` | error | Domain → Adapter 금지 |
| `no-circular` | error | 순환 의존성 금지 |
| `adapter-subpackages-isolation` | warn | Adapter 하위 패키지 간 격리 |
| `webapi-not-depend-on-other-adapters` | warn | WebAPI → 다른 Adapter 금지 |

### 위반 예시

```typescript
// ❌ src/domain/member/member.ts
import { MemberRepository } from '@/adapter/persistence/member-repository';
// error: domain-not-depend-on-adapter

// ❌ src/application/member/member.service.ts
import { MemberApi } from '@/adapter/webapi/member-api';
// error: application-not-depend-on-adapter
```

### 올바른 예시

```typescript
// ✅ src/domain/member/member.ts
import { Email } from '@/domain/shared/email';

// ✅ src/application/member/member.service.ts
import { Member } from '@/domain/member/member';
import { MemberRepository } from '@/application/member/required/repository.port';

// ✅ src/adapter/persistence/member-typeorm-repository.ts
import { MemberRepository } from '@/application/member/required/repository.port';
import { Member } from '@/domain/member/member';
```

### NestJS Module 예외

`*.module.ts`는 **Composition Root** 역할이므로 Adapter 참조를 예외로 허용합니다.

```typescript
// ✅ src/application/member/member.module.ts
import { MemberRepositoryImpl } from '@/adapter/persistence/member-typeorm-repository';
// Module 파일은 DI 설정을 위해 예외적으로 허용
```

---

## CI/CD 통합

### GitHub Actions

```yaml
# .github/workflows/arch-test.yml
name: Architecture Test

on: [push, pull_request]

jobs:
  arch-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run arch:test
```

### Pre-commit Hook

```bash
# .husky/pre-commit
bun run arch:test
```

---

## 트러블슈팅

### TypeScript 경로 별칭(@/) 인식 안 됨

`tsConfig` 옵션 확인:

```javascript
options: {
  tsConfig: { fileName: 'tsconfig.json' },
}
```

### node_modules 의존성까지 검사됨

`includeOnly` 또는 `doNotFollow` 설정:

```javascript
options: {
  doNotFollow: { path: ['node_modules'] },
  includeOnly: ['^src/'],
}
```

### 규칙이 적용 안 됨

1. 정규표현식 확인 (^ 시작, 이스케이프 등)
2. `severity: 'ignore'`가 아닌지 확인
3. `pathNot`으로 제외되지 않았는지 확인

```bash
# 디버깅: 의존성 그래프를 JSON으로 출력하여 확인
npx depcruise src --output-type json | jq '.modules[].source'
```
