---
name: Billed Project Memory
description: Full-stack billing and expense tracking application
type: Full-Stack
project: Billed
category: Full-Stack Application
phase: Active Development
updated: 2026-03-23
tags:
  - Express
  - Node.js
  - Vanilla JavaScript
  - SQLite
  - Form Handling
  - File Uploads
  - Authentication
  - Testing
---

# Billed Memory Index

**Last Consolidated:** March 23, 2026

## Quick Reference

| Section | Purpose |
|---------|---------|
| [Frontend Architecture](frontend_architecture.md) | SPA structure, form handling, bill management UI |
| [Backend API Design](backend_api.md) | Express routes, controllers, data models |
| [Authentication & Security](authentication.md) | JWT, password hashing, authorization checks |
| [File Uploads](file_uploads.md) | Multer configuration, validation, storage |
| [Database Schema](database.md) | SQLite tables, relationships, migrations |
| [Testing Strategy](testing_strategy.md) | Jest, Supertest, Testing Library |
| [Common Issues & Solutions](troubleshooting.md) | Known problems and workarounds |

## Project Overview

**Billed** is a full-stack expense tracking and billing application with file upload support.

- **Tech Stack:** Vanilla JS + Express.js + SQLite
- **Frontend:** Single Page Application with form management
- **Backend:** RESTful API with JWT authentication
- **Files:** Upload and store bill documents with Multer
- **Testing:** Jest for units, Supertest for API integration, Testing Library for UI
- **Build:** Parcel bundler for frontend, Node.js for backend

## Phase & Status

- **Phase:** Active Development
- **Memory Status:** ✅ Index created, detailed patterns pending
- **Next Review:** April 20, 2026

## Key Learnings by Category

### Frontend Architecture
- **Pattern:** Vanilla JS SPA with manual state management
- **File Structure:** `index.html`, `views/` (pages), `containers/` (components), `utils/`
- **State Management:** Global state object updated on actions
- **Forms:** Bill creation, expense entry, settings
- **Data Display:** Bill list with filters, expense breakdown

### Backend API Design
- **Base Path:** `/api/` for all endpoints
- **Resources:** /bills, /expenses, /users
- **Authentication:** Authorization header with JWT token
- **Error Responses:** Consistent format with status code + message
- **Validation:** Input sanitization in controllers

### Database Schema
- **Tables:**
  - `users` (id, email, password_hash, name, created_at)
  - `bills` (id, user_id, file_url, date, amount, status)
  - `expenses` (id, bill_id, description, amount, category)
- **Relationships:** Foreign keys enforce referential integrity
- **Indexes:** On user_id, date for query performance

### File Upload Handling
- **Multer Config:** Store in `uploads/` directory, limit 5MB per file
- **Validation:** Check file type (PDF, image), reject unknown types
- **Security:** Generate unique filename to prevent overwrites
- **Cleanup:** Delete uploaded file if bill creation fails

### Authentication & Authorization
- **Flow:** Login → receive JWT → attach to requests → verify on backend
- **JWT Payload:** user_id, email, exp time
- **Password:** Hash with bcrypt before storing
- **Middleware:** Check Authorization header, verify token before route access

### Testing Patterns
- **Unit Tests:** Test validators, helpers, utility functions in isolation
- **Integration Tests:** Test API endpoints with real database (test DB)
- **UI Tests:** Test form submission, data display, user interactions
- **Fixtures:** Sample bills and expenses for consistent testing

## Related Files

- **Frontend source:** `/frontend/src/`
- **Backend source:** `/backend/src/`
- **Tests:** `/tests/` (organized by feature)
- **Database:** `/database/schema.sql`
- **Project config:** CLAUDE.md (overview), package.json (dependencies)

## Monthly Review Checklist

- [ ] Review new API endpoints added
- [ ] Check test coverage for controllers
- [ ] Verify error handling is consistent
- [ ] Audit file upload validation logic
- [ ] Update authentication flow if needed

---

**Next Step:** Create detailed backend_api.md and frontend_architecture.md files.
