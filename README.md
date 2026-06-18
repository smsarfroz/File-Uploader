<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/c0b5c9e3-06a3-4c50-a9dd-05e48c5fdcca" />

<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/8bc6af9c-85dd-463a-b872-e90e492533f2" />

<img width="1917" height="901" alt="image" src="https://github.com/user-attachments/assets/0d7faac3-7783-4357-a4d8-f8936252fd38" />

<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/9719b53f-76a1-4bfc-915a-18eabb7a45b3" />

# File Uploader

A stripped-down version of Google Drive - your personal file storage service! Upload, organize, and manage your files with ease.

## Features

- User authentication with Passport.js
- Upload files (images, documents, videos, and more)
- Create folders to organize your files
- Move files between folders
- View file details (name, size, upload time)
- Download files with one click
- File validation (type and size restrictions)
- Session persistence in database
- Secure file storage with cloud services

## Tech Stack

- Node.js & Express
- PostgreSQL with Prisma ORM
- Passport.js for authentication
- Multer for file uploads
- Cloudinary / Supabase for cloud storage
- EJS for templating
- Prisma Session Store for session persistence

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Set up your PostgreSQL database
4. Configure your `.env` file with:
   - Database credentials
   - Cloud storage API keys
   - Session secret
5. Run Prisma migrations: `npx prisma migrate dev`
6. Run `npm start`

## File Validation

- File types: Images, documents, videos, audio, and more
- File size limit: Configurable (e.g., 50MB max)
- Validates before upload to ensure security

## Database Schema

- **User** - id, username, email, password (hashed)
- **Folder** - id, name, ownerId, parentFolderId, createdAt, updatedAt
- **File** - id, name, size, url, folderId, ownerId, uploadedAt

## What I Learned

- Setting up Express with Prisma ORM
- Implementing session-based authentication with Passport.js
- File uploads using Multer
- Cloud storage integration (Supabase)
- File validation and security best practices
- CRUD operations with database relationships
- Session management with Prisma session store
- Working with foreign keys and relational data

---

Made with ❤️ as part of The Odin Project curriculum