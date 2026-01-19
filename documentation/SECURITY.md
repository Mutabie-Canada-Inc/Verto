# Security & Production Readiness

This document outlines the security measures and production-hardening steps implemented in the Zoop application.

## 1. Score Validation (Anti-Cheat)
To prevent client-side score manipulation, all game wins are validated server-side.
- **Mechanism**: When a user completes a puzzle, the full path is sent to a Server Action (`submitScore`).
- **Validation**:
    - **Length Check**: Path must contain exactly `TOTAL_CELLS` (36).
    - **Sequence Check**: Values must strictly follow `n, n+1, n+2` order.
    - **Geometry Check**: Moves must be strictly orthogonal (Manhattan distance of 1). Diagonals are rejected.
    - **Seed Verification**: (Planned) Validate against server-stored board seed.

## 2. Injection Protection (XSS/SQLi)
- **XSS**: The application uses React's JSX rendering, which automatically escapes content. No `dangerouslySetInnerHTML` is used.
- **SQLi**: While currently using in-memory logic, future database connections should use an ORM (Prisma/Drizzle) with parameterized queries.

## 3. Denial of Service (DDoS)
- **Edge Deployment**: The application is designed to be deployed on Edge networks (Vercel), which provide distinct DDoS mitigation layers.
- **Rate Limiting**: Server Actions should be rate-limited in a full production environment (e.g., using `@upstash/ratelimit`).
- **Input Cap**: Inputs are strictly typed and bounds-checked. Large payloads are rejected by Next.js defaults.

## 4. UI/UX Consistency
- **Centralized Theme**: All core colors are defined in `globals.css` using CSS variables (`--color-zoop-*`). This allows for instant theming updates without code changes.
- **Accessibility**: Semantic HTML and ARIA-friendly structures are used where possible.

**Last Updated**: 2026-01-19
**Author**: Mutabie Canada Inc. AI Team
