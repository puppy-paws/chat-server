# chat-server

## 기술 스택

### 개발
<div>
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101">
  <img src="https://img.shields.io/badge/TypeORM-EC1C24?style=for-the-badge&logo=0auth&logoColor=white">
</div>

### DB
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### DevOps

<div>
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"> 
  <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white">
  <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white">
</div>

### 프로젝트 관리

![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)
![Confluence](https://img.shields.io/badge/confluence-%23172BF4.svg?style=for-the-badge&logo=confluence&logoColor=white)

### 커뮤니티 및 소통

![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)

## 전체 구성도
![image](https://github.com/user-attachments/assets/53d1023a-dbf4-439c-8e13-8b62f7f4abdc)


## ERD
![image](https://github.com/user-attachments/assets/83ea65a5-5767-43fa-b037-c9f4546f3df5)


## 설치 및 실행방법

- .env
```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
```

- 로컬에서 Docker로 서버 실행하기
  - PostgreSQL, Redis는 로컬 피시에서 실행되고 있다는 가정하에 실행 합니다.
```
docker compose up -d .
```
