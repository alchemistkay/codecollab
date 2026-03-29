# CodeCollab — Work Tracker

## Current Status
Active development. UI redesign complete. K8s deployment live.

---

## In Progress

- [ ] (nothing active right now)

---

## Done

- [x] UI redesign — dark theme (`#0a0a09` bg, `#4ade80` green) inspired by beans.talk aesthetic
  - New `LandingPage.jsx` with Nav, Hero, How it Works, Features, FAQ, CTA
  - `App.jsx` view state: `'landing'` → `'editor'` transition
  - `index.css` with global CSS vars, animations, scrollbar styles
- [x] Fix: landing page flash on shared session link
  - `view` state now lazy-initialized from URL so editor loads on first render (no flash)
- [x] Kubernetes / K3s deployment (hybrid architecture)
- [x] Production-grade K8s features (PR #7)

---

## Backlog

- [ ]

---

## Notes

- Shared links use `?session=<id>` query param
- Design tokens are in `App.jsx` (`C` object) and `src/index.css` (CSS vars) — keep in sync
- Live demo: https://codecollab.k4scloud.com
