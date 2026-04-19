# Railway Deployment Guide

## 🚀 การตั้งค่า Railway สำหรับ Bio Link + URL Shortener

### 📋 ขั้นตอนที่ต้องทำ:

1. ✅ สร้าง Railway account
2. ✅ Push code ขึ้น GitHub
3. ✅ ตั้งค่า environment variables บน Railway
4. ✅ ใช้ Railway PostgreSQL database
5. ✅ Deploy และทดสอบ

---

## 🛠 ขั้นตอนที่ 1: สร้าง Railway Account

1. ไปที่ [railway.app](https://railway.app)
2. Sign up หรือ Login ด้วย GitHub account
3. สร้าง New Project

---

## 📁 ขั้นตอนที่ 2: Push Code ขึ้น GitHub

```bash
# ถ้ายังไม่ได้ init git
git init
git add .
git commit -m "Initial commit"

# เพิ่ม remote origin
git remote add origin https://github.com/username/bio-link-shortener.git

# Push ขึ้น GitHub
git push -u origin main
```

---

## ⚙️ ขั้นตอนที่ 3: ตั้งค่า Railway

### 3.1 เชื่อมต่อ GitHub Repository

1. ใน Railway dashboard → คลิก "New Project"
2. เลือก "Deploy from GitHub repo"
3. เชื่อมต่อ GitHub account ของคุณ
4. เลือก repository `bio-link-shortener`
5. คลิก "Deploy Now"

### 3.2 ตั้งค่า Environment Variables

ใน Railway project → คลิก "Variables" และเพิ่ม:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Admin password
ADMIN_PASSWORD=your_secure_admin_password

# Next.js secrets
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=https://your-app-name.railway.app

# App URL
APP_URL=https://your-app-name.railway.app
```

**คำอธิบาย:**
- `DATABASE_URL` Railway จะสร้าง PostgreSQL ให้อัตโนม
- `ADMIN_PASSWORD` รหัสผ่านสำหรับ admin
- `NEXTAUTH_SECRET` คีย์ลับสำหรับ session
- `NEXTAUTH_URL` และ `APP_URL` ใช้ URL ของ Railway app

---

## 🐘 ขั้นตอนที่ 4: ใช้ Railway Database

### 4.1 เพิ่ม PostgreSQL Service

1. ใน Railway project → คลิก "New Service"
2. เลือก "PostgreSQL"
3. ตั้งค่า service name (เช่น `bio-link-db`)
4. คลิก "Add PostgreSQL"

### 4.2 อัปเดต์ DATABASE_URL

หลังจากที่เพิ่ม PostgreSQL service:

1. คลิกที่ PostgreSQL service
2. คลิก "Connect" tab
3. คัดลอก `DATABASE_URL`
4. คัดลอกมาใส่งใน Environment Variables ของ app

---

## 🚀 ขั้นตอนที่ 5: Deploy และ Migration

### 5.1 Automatic Deploy

Railway จะ:
- Install dependencies อัตโนม
- Build application ด้วย `npm run build`
- Start server ด้วย `npm run start`

### 5.2 Run Database Migrations

เมื่อ deploy สำเร็จ:

1. คลิกที่ app service
2. คลิก "Logs" เพื่อดู build process
3. รอให้ build สำเร็จ
4. เปิด app URL ใน browser

---

## 🔧 การตั้งค่า Database ครั้งงาน

### 6.1 สร้าง Tables

Railway จะ run migrations อัตโนม:

```bash
# Railway จะ run คำสั่งนี้อัตโนม:
npx prisma db push
```

### 6.2 Seed Database

เพื่อเพิ่มข้อมูลตัวอย่าง:

```bash
# Railway จะ run คำสั่งนี้:
npm run db:seed
```

หรือใช้ Railway Console:

1. คลิก PostgreSQL service
2. คลิก "Query" tab
3. รัน SQL queries จาก `prisma/seed.ts`

---

## 🌐 การเข้าถึง Application

### 7.1 หน้าแรก

- URL: `https://your-app-name.railway.app`
- แสดง bio page ของ user

### 7.2 Admin Dashboard

- URL: `https://your-app-name.railway.app/secret-admin`
- Login ด้วย password ที่ตั้งไว้ใน `ADMIN_PASSWORD`

### 7.3 URL Shortener

- Short URL: `https://your-app-name.railway.app/s/github`
- จะ redirect ไปยัง target URL

---

## 🔍 การตรวจสอบและ Debug

### 8.1 ดู Logs

1. ใน Railway dashboard → คลิก app service
2. คลิก "Logs" tab
3. ดู console logs และ error messages

### 8.2 Health Check

- URL: `https://your-app-name.railway.app/api/health`
- ควรวจสอบว่า app ทำงานปกติ

### 8.3 Database Connection

1. คลิก PostgreSQL service
2. คลิก "Query" tab
3. ทดสอบ connection ด้วย SQL query

---

## 🛠 การแก้ไขปัญหาที่พบบ่อย

### ปัญหา: Database connection failed

**สาเหตุ:** `DATABASE_URL` ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ PostgreSQL service ใน Railway
2. คัดลอก `DATABASE_URL` ใหม่
3. อัปเดต์ environment variables ใน Railway

### ปัญหา: Build failed

**สาเหตุ:** Dependencies หรือ TypeScript errors

**วิธีแก้:**
1. ดู build logs ใน Railway
2. ตรวจสอบ `package.json`
3. แก้ไข TypeScript errors

### ปัญหา: Admin login ไม่ได้

**สาเหตุ:** Password ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ `ADMIN_PASSWORD` ใน Railway variables
2. รัน seed script ใหม่:
   ```bash
   npm run db:seed
   ```

---

## 📊 การ Monitor Application

### Metrics ที่ควรดู:

- **Uptime:** ใน Railway dashboard
- **Response time:** ด้วย health check
- **Error rate:** ใน application logs
- **Database performance:** ใน PostgreSQL metrics

---

## 🔄 การอัปเดต์ Application

### 10.1 อัปเดต์ Code

```bash
# แก้ไข code
git add .
git commit -m "Update features"
git push origin main
```

Railway จะ deploy อัตโนมหลังจาก GitHub

### 10.2 อัปเดต์ Environment

1. แก้ไข variables ใน Railway dashboard
2. Railway จะ restart service อัตโนม
3. ตรวจสอบ changes ใน logs

---

## 🎯 สรุปการใช้งาน

1. **Development:** ใช้ local PostgreSQL
2. **Staging:** ใช้ Railway staging
3. **Production:** ใช้ Railway ด้วย custom domain
4. **Backup:** Railway มี automatic backup

---

## 📞 ติดต่อ Support

ถ้าพบปัญหา:

1. ดู Railway logs ก่อน
2. ตรวจสอบ environment variables
3. อ่าน README สำหรับ troubleshooting
4. สร้าง issue บน GitHub repository

---

**✅ เมื่อทำตามขั้นตอนนี้ จะได้ application ที่ทำงานบน Railway ด้วย PostgreSQL database!**
