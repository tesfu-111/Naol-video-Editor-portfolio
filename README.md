# KINETIC — Creative Director & Video Editor Portfolio

An award-caliber, full-stack video editor portfolio built with React, TypeScript, Tailwind CSS, Express, and Google Cloud Firestore.

---

## 🌟 Key Features

1. **Dual Background Modes**:
   - **Image Mode**: Full-screen high-resolution editorial portrait or still.
   - **Video Mode**: Muted, looping video stream with instant image fallback and reduced-motion compliance.
   - Switchable at any time from the Admin Dashboard without touching code.

2. **Curated Work Gallery & Categorization**:
   - Live filtering across 8 industry-standard genres: Short-Form Content, YouTube Editing, Reels & TikTok, Music Videos, Cinematic Edits, Promotional Videos, Motion Graphics, and Color Grading.
   - Live keyword search.
   - Respects draft vs. published state.

3. **Multi-Format Video Playback Engine**:
   - **Direct Uploads**: Native HTML5 player with scrub bar, duration tracker, mute/unmute, and fullscreen.
   - **External Links**: Zero-clutter embeds for YouTube (nocookie), Vimeo, and Google Drive video previews.
   - Graceful offline / error handling for inaccessible streams.

4. **Dedicated About Me & Creative Process**:
   - Editorial portrait, bio, career milestones, specialized software badges, and a 5-step post-production workflow breakdown.
   - Downloadable CV / resume PDF support.

5. **Services & Direct Inquiry Funnel**:
   - 8 editable service cards with toggleable price estimates.
   - "Inquire Service" CTA automatically preselects the requested service in the contact form and scrolls smoothly to it.

6. **Validated Contact Form with Spam Defense**:
   - Input validation, honeypot protection, and real-time Firestore persistence.
   - Editable social channels (WhatsApp, Telegram, Instagram, TikTok, YouTube, LinkedIn).

7. **Protected Admin CMS Dashboard**:
   - **Overview**: Real-time project counts, draft counts, and inquiry queue.
   - **Projects**: Create, edit, preview, reorder, publish/unpublish, and delete.
   - **Media Library**: Upload videos, images, and documents with progress feedback and URL copy.
   - **Homepage Settings**: Switch background mode, edit headline, subtitle, and CTA buttons.
   - **About Me**: Edit biography, portrait, skills, and creative process.
   - **Services**: Manage service cards, pricing, and features.
   - **Contact**: Update email, phone, and social handles.
   - **Inquiries**: Review incoming client briefs, change status (New, Reviewed, Archived), and reply.
   - **Website Settings**: Adjust site branding, logo text, SEO metadata, and accent colors.

---

## 🚀 Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend Server**: Node.js & Express (`server.ts`) with Vite middlewares in development.
- **Database & Auth**: Google Cloud Firestore & Firebase Auth (`buoyant-kingdom-2bcxw`).
- **Storage Adapter**: Hybrid Cloud storage adapter serving files via `/api/upload` with Multer file validation (150MB limit) and Firestore metadata synchronization.

---

## 🔑 Initial Administrator Creation & Access

1. **Google Sign-In (Configured Owner)**:
   - The primary owner account is set to **`tesfukebe000@gmail.com`**.
   - When signing in via Google with this account, admin privileges are automatically verified and granted in Firestore rules and session state.

2. **Master Passcode Fallback**:
   - Click the **"Admin"** button in the navigation or footer.
   - Enter the server admin passcode (default: `kinetic2026`, configurable via `ADMIN_PASSCODE` in environment variables) to authenticate immediately.

---

## 📦 Running & Testing Locally

```bash
# Start full-stack development server (Express + Vite on port 3000)
npm run dev

# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build
```
