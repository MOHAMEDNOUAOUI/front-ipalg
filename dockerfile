FROM docker.io/library/node:18-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy only the source code needed for the build
COPY . .

# Build Angular for staging (minified, AOT, output hashing)
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache gettext

# Copy built Angular files (minified + obfuscated)
COPY --from=builder /app/dist/kockpit/browser /usr/share/nginx/html

# Copy the production build files into the Nginx container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 4200

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
