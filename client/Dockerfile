# Use Node.js image
FROM node:16 as build


WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.19-alpine
COPY --from=build /app usr/share/nginx/html
# FROM node:19 as build


# WORKDIR /app

# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install
# COPY . ./
# RUN npm ci
# RUN npm run build


# WORKDIR /app
# COPY --from=build /app .


# # ENV HOST=0.0.0.0
# # EXPOSE 5173
# CMD ["node" ,"build/index.js"]