FROM node:18-alpine
ENV PORT=80

RUN apk --no-cache add build-base
RUN apk add python3

WORKDIR app
COPY . .
COPY env/prod/.env .

COPY package.json .

RUN npm install
EXPOSE $PORT
CMD npx prisma db push && npx prisma generate && npm run build && npm run start:prod