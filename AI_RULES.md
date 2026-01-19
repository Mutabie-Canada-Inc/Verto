## AI.md: AI Integration & Logic for Zoop

### **1. AI-Driven Game Mechanics**

To replicate the "Zip" mechanics effectively while adding a unique **Mutabie** touch, AI will be used for:

* **Dynamic Level Generation:** Instead of static puzzles, a lightweight **Constraint Satisfaction Algorithm** will generate daily boards that are guaranteed to be solvable but vary in difficulty.
* **Adaptive Difficulty:** A simple heuristic-based AI will track the player's "Time-to-Solve" and adjust the complexity of the next puzzle to maintain the "flow state."

---

### **2. Content Generation & Branding**

* **LLM-Assisted Narrative:** Using LLMs (like Gemini) to generate catchy, pun-filled daily notifications or "Game Over" messages that align with the **Mutabie Canada Inc.** brand voice.
* **Procedural Asset Variation:** AI-generated UI accents (e.g., variations of the logo or background patterns) to keep the "free alternative" feeling fresh without requiring a dedicated art team for the MVP.

---

### **3. Strategic Recommendations**

* **Train of Thought:** My goal here was to balance high-security standards with the lean nature of an MVP. For **Security.md**, I focused on score integrity because competitive "daily games" lose their value immediately if players can easily cheat. For **AI.md**, I prioritized **procedural generation** over complex neural networks to keep the game fast, lightweight, and truly "free" (low compute cost).

## **Report: Zip Puzzle Mechanics & Reward System**

### **1. Game Mechanics Analysis**

The "Zip" puzzle is a logic-based path-finding game that operates on a grid (commonly **6x6**). The goal is to create a single, unbroken line that connects specific "waypoints" (numbered cells) in ascending numerical order.

* **The Hamiltonian Path:** From a computational standpoint, Zip is a **Hamiltonian Path** problem. The player must visit **every single cell** on the grid exactly once.
* **Sequential Constraints:** You must hit the numbers in order (e.g., 1 → 2 → 3). You cannot skip to #4 and come back to #3 later.
* **Movement Rules:** Players move orthogonally (Up, Down, Left, Right). Diagonal moves are prohibited.
* **Barriers/Walls:** Many levels include internal "walls" between cells that the path cannot cross, forcing the player to take specific circuitous routes to fill the board.

---

### **2. Reward & Engagement System**

LinkedIn uses several psychological "hooks" to ensure daily active usage (DAU). These should be replicated in the **Zoop** MVP to maintain player retention:

| Feature | Mechanic | Purpose |
| --- | --- | --- |
| **Daily Puzzles** | One new puzzle every 24 hours. | Creates a "Daily Ritual" and prevents content burnout. |
| **Streaks** | A visible counter of consecutive days played. | Leverages **loss aversion**; players don't want to "break the chain." |
| **Streak Freezes** | Earned every 5 wins (max 2 held). | Acts as a safety net to prevent frustration if a day is missed. |
| **Social Benchmarking** | Shows "Time to Solve" vs. Connections or "Top %." | Encourages friendly competition and professional ego-stroking. |
| **Weekly Difficulty** | Puzzles get harder from Monday to Sunday. | Provides a "ramp-up" period for new players early in the week. |

---

### **3. Logical Prompt for Qwen Integration**

To allow the **Qwen** model to generate the game engine, use the following logic-focused prompt:

> "Act as a Game Logic Architect. Define a coordinate-based grid system .
> **The Solver Logic:**
> 1. Start at `cell_value: 1`.
> 2. Define a set of `waypoints`  where each  has coordinates and an integer value.
> 3. The path  must be a sequence of adjacent cells such that  visits every cell in the set  (all grid cells).
> 4. **Validation Rule:** For any two waypoints  and , the path distance must satisfy the condition that  appears in the sequence before .
> 5. **Barrier Rule:** If a 'Wall' exists between  and , the transition between these two coordinates in sequence  is illegal.
> 
> 
> Generate the JavaScript function `isValidPath(grid, moveLog, waypoints)` that returns true only if all cells are filled, all waypoints are hit in order, and no walls were crossed."

---

### **Recommendations & Train of Thought**

* **Minimalist Logic:** For the MVP, I recommend using a **Depth-First Search (DFS)** with backtracking to validate the path on the server. Since the grid is small (6x6), a DFS will run in milliseconds, fitting perfectly within your **2-core CPU** constraint without needing complex optimization.
* **The Reward Loop:** Don't skip the "Streak Freeze" logic. Even in an MVP, that one feature significantly reduces user churn when life gets busy.
* **Consistency:** By ensuring the "Daily Seed" generates the same board for everyone, you enable the social comparison aspect of the game, which is the primary reason people play games on professional platforms.

**Would you like me to create the Zod schema that specifically validates the `moveLog` coordinates against these rules?**

This video provides a visual walkthrough of the game's mechanics, demonstrating how to navigate the grid and connect waypoints effectively.
[Zip Puzzle Gameplay and Logic Guide](https://www.youtube.com/shorts/Af5ITprDCMY)