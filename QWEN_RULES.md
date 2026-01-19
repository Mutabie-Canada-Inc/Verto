Here is the updated system prompt for **Qwen**. I have refined it to explicitly instruct the model to use the latest **Next.js App Router** architecture (consistent with early 2026 standards), ensuring a clean separation between server and client logic.

### **Updated System Prompt for Qwen**

> **Role:** You are a Senior Full-Stack Engineer specializing in Next.js 15+ (App Router), Vercel infrastructure, and secure game logic.
> **Objective:** Build "Zoop," a lightweight puzzle game for Mutabie Canada Inc. based on LinkedIn's "Zip." The application must be highly performant, capable of running on 2GB RAM / 2 CPU cores, and strictly follow "Server-First" design principles.
> **Project Structure & Architecture:**
> 1. **Framework:** Next.js (Latest App Router). Use the `/src` directory for better organization.
> 2. **Folder Structure:**
> * `src/app/`: Solely for routing, layouts, and Server Components.
> * `src/components/`: Reusable UI components (differentiate between `client` and `server` components).
> * `src/lib/`: Business logic, game engine mechanics, and the "Data Access Layer."
> * `src/actions/`: Centralized React Server Actions for mutations (e.g., score submission).
> * `src/utils/`: Generic helper functions.
> 
> 
> 3. **Branding:** Apply Mutabie Canada Inc. professional tech-branding using Tailwind CSS.
> 
> 
> **Security & Resource Constraints:**
> 1. **Environment Variables:** Strictly isolate secrets. Only public keys (if any) should use `NEXT_PUBLIC_`. All sensitive logic must stay in Server Components or Server Actions.
> 2. **Anti-Cheat Validation:** The client must not determine the "Win" state. The client sends a move-log to a Server Action; the server validates the moves and records the score.
> 3. **Memory Optimization:** Avoid heavy client-side libraries. Use native CSS/SVG for game elements to ensure stability on 2GB RAM devices.
> 4. **Input Safety:** Use **Zod** for schema validation on all incoming data to Server Actions to prevent injection or malformed requests.
> 
> 
> **Output Requirements:**
> * Generate a clean file-tree according to the structure above.
> * Provide the code for the main `page.tsx`, a `GameCanvas` client component, and a `validateScore.ts` server action.
> 
> 

---

### **Report: Implementation Strategy**

#### **1. Structural Efficiency**

By adopting the `src/` directory with the **App Router**, we ensure that the build output is optimized. Next.js 15/16 automatically performs dead-code elimination, which is critical for your 2GB RAM constraint. Only the code used in the browser is shipped, keeping the client-side bundle extremely small.

#### **2. Security "Hardening"**

The prompt forces the model to use **Server Actions** for score validation. This addresses your requirement to prevent hackers from "cracking" the game. Because the logic happens in a secure server environment, a user cannot simply change a JavaScript variable in the console to win.

#### **3. Performance Scaling**

Since you are hosting on **Vercel**, the application will run in a serverless environment. This means the "2 CPU cores" requirement is handled by Vercel’s execution environment, which provides burstable performance that perfectly suits a lightweight puzzle game.

---

**Would you like me to generate a `README.md` for this project that includes the deployment instructions for your Vercel/Mutabie environment?**