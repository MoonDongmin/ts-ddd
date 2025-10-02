<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 프로젝트 설명

**Splearn**(스프런)은 회원이 강의를 수강하는 온라인 학습 플랫폼입니다.

스프링 프레임워크의 철학(Spring)을 바탕으로 학습자(Learner)가 성장하는 학습 생태계를 목표로 하며, Domain-Driven Design (DDD) 패턴을 적용하여 [NestJS](https://github.com/nestjs/nest) TypeScript로 구현한 프로젝트입니다.

### 주요 도메인
- **회원**: 강의를 수강하고 학습하는 사용자
- **강사**: 강의를 생성하고 제공하는 회원
- **강의**: 섹션과 수업으로 구성된 학습 컨텐츠
- **수강**: 강의를 학습하고 진도를 기록하는 활동

## 프로젝트 설정

```bash
$ bun install
```

## 프로젝트 컴파일 및 실행

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## 테스트 실행

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## 리소스

NestJS 작업 시 유용할 수 있는 몇 가지 리소스를 확인하세요:

- 프레임워크에 대해 자세히 알아보려면 [NestJS 문서](https://docs.nestjs.com)를 방문하세요.

## 지원

Nest는 MIT 라이선스 오픈 소스 프로젝트입니다. 놀라운 후원자들의 스폰서십과 지원 덕분에 성장할 수 있습니다. 참여하고 싶으시다면 [여기에서 자세히 알아보세요](https://docs.nestjs.com/support).

## 라이선스

Nest는 [MIT 라이선스](https://github.com/nestjs/nest/blob/master/LICENSE)를 따릅니다.
