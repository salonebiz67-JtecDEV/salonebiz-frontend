# 🇸🇱 SaloneBiz Frontend

Professional mobile-first frontend for SaloneBiz.

## Structure

```text
salonebiz-frontend/
│
├── index.html
├── README.md
│
└── assets/
    ├── css/
    │   ├── base.css
    │   ├── animations.css
    │   ├── auth.css
    │   └── workspace.css
    │
    └── js/
        ├── config.js
        ├── api.js
        ├── auth.js
        ├── ui.js
        ├── auth-page.js
        ├── workspace.js
        └── app.js

                    SALONEBIZ
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      HOME          FRIENDS         CREATE
        │              │              │
      Posts        Discover       Image post
        │              │              │
   ❤️ Like         Follow        Business
   💬 Comment                       │
   ↗️ Share                         │
   ⭐ Favorite                      │
        │
        ├──────────────┐
        │              │
      INBOX          PROFILE
        │              │
    Messages       User info
    Activity       Posts
                   Favorites
                   Followers
