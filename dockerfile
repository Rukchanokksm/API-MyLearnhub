FROM node:latest

ENV PORT=8000
ENV REDIS_URL=redis://rd:6379
# redis://rd:6379
ENV DATABASE_URL="postgresql://postgres:academy@pg:5432/postgres?schema=public"
# postgresql://postgres:academy@pg:5432/postgres?schema=public

WORKDIR /home/app

COPY . .

RUN npm i -g pnpm
RUN pnpm i
RUN npx tsc

CMD ["node", "dist/nodeserver.js"]