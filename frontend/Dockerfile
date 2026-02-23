FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

RUN npm install react-scripts@latest

COPY . .

EXPOSE 3000

ENV NODE_OPTIONS=--no-warnings

CMD ["npm", "start"]
