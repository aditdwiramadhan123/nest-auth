# Gunakan image resmi Node.js sebagai base image
FROM node:18-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies di dalam container
RUN npm install

# Copy semua file aplikasi ke dalam container
COPY . .

# Jalankan migrasi Prisma
RUN npx prisma generate && npx prisma migrate deploy

# Build aplikasi NestJS
RUN npm run build

# Set environment variable jika diperlukan (optional)
ENV NODE_ENV=production

# Expose port yang akan digunakan oleh aplikasi (misal: 3000)
EXPOSE 3000

# Jalankan aplikasi NestJS
CMD ["npm", "run", "start:prod"]
