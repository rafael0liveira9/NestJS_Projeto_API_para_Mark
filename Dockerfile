FROM --platform=linux/amd64 node:18-alpine

RUN apk --no-cache add build-base
RUN apk add python3

WORKDIR app
COPY . .
COPY env/prod/.env .

COPY package.json .

RUN npm install
EXPOSE 80
# RUN chmod +x docker-entrypoint.sh
# ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD npx prisma db push && npx prisma generate && npm run build && npm run start:prod