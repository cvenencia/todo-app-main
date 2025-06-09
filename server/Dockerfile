FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

ENV PORT 3000
EXPOSE 3000
RUN chmod +x /app/start.sh

CMD /app/start.sh
