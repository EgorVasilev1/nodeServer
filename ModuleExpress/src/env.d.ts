// src/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      HOSTNAME: string;
      PORT: string;
      PG_HOST: string;
      PG_PORT: string;
      PG_USER: string;
      PG_PASSWORD: string;
      PG_DATABASE: string;
      PG_SSL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      SECRET_KEY: string;
      REFRESH_SECRET_KEY: string;
    }
  }
  