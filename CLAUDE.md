# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Domain-Driven Design (DDD) 패턴을 탐구하기 위한 NestJS TypeScript 프로젝트입니다. Bun 런타임을 사용합니다.

## 개발 명령어

### 패키지 관리
- 설치: `bun install`

### 실행
- 개발 (watch 모드): `bun run start:dev`
- 개발: `bun run start`
- 디버그: `bun run start:debug`
- 프로덕션: `bun run start:prod`

### 빌드 & 코드 품질
- 빌드: `bun run build`
- 린트: `bun run lint`
- 포맷: `bun run format`

### 테스트
- 유닛 테스트: `bun run test`
- 단일 테스트 (watch): `bun run test:watch -- <test-file-path>`
- E2E 테스트: `bun run test:e2e`
- 커버리지: `bun run test:cov`
- 디버그: `bun run test:debug`

### 데이터베이스
- Docker Compose를 통해 MySQL이 13306 포트에서 실행됨
- 시작: `docker-compose up -d`
- 종료: `docker-compose down`

## 아키텍처

### TypeScript 설정
- Target: ES2023, Module: NodeNext (ESM 호환)
- Path alias: `@/*` → `src/*` (tsconfig.json과 Jest에 모두 설정됨)
- Decorators 활성화, strict null checks 활성화

### 애플리케이션 구조
- 진입점: `src/main.ts` (포트 3000 또는 PORT 환경 변수)
- 루트 모듈: `src/app.module.ts`
- DDD 도메인 모듈을 위한 초기 스캐폴드

### 테스팅
- Jest 30+ with ts-jest
- 유닛 테스트: `*.spec.ts` 패턴
- E2E 테스트: `test/` 디렉토리의 `*.e2e-spec.ts` (별도 설정)
- moduleNameMapper를 통해 테스트에서 path alias 사용 가능
