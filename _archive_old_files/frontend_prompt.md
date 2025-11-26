# Ultra-Detailed Prompt for StreamPay Frontend Generation

**Role:** You are a World-Class Frontend Architect and UI/UX Designer specializing in "Future-Fi" (Futuristic Finance) interfaces. You have won multiple Awwwards for Web3 dashboards.

**Objective:** Create a breathtaking, production-ready React frontend for **StreamPay** - a real-time payment streaming platform built on the Linera blockchain.

---

## 0. Current State & Starting Point (Where we are now)

**We already have a working MVP frontend, but it needs a massive UI/UX upgrade.**

*   **Current Tech:** React + Vite + Vanilla CSS (`App.css`) + Framer Motion.
*   **Current Functionality:**
    *   **"Smart Hybrid" Mode:** It checks if the backend (GraphQL on port 8080) is alive. If yes, it connects; if no, it shows demo data. **You must preserve this logic.**
    *   **Live Counter:** We have a `LiveCounter.tsx` that updates every 100ms. It works well but looks too simple.
    *   **Deployment Info:** The footer currently displays the specific App IDs and Chain ID.
*   **Current Aesthetic:** Basic dark mode with some neon green/purple gradients. It looks "okay" but not "mind-blowing."
*   **The Goal:** Take this functional base and turn it into a **"Bloomberg Terminal from 2077"**. We want to move from "Hackathon MVP" to "Billion Dollar DeFi Protocol."

---

## 1. Project Context (What you are building)

**StreamPay** is a revolutionary payment platform that allows money to flow like water. Instead of monthly paychecks, users get paid *every second*.
- **Blockchain:** Linera (Layer 1, sub-50ms finality).
- **Core Mechanism:** A sender creates a stream (e.g., salary) to a recipient. The recipient's balance updates in real-time, every second.
- **Key Features:**
    1.  **Live Counter:** The heart of the app. A large, animated number that increments in real-time.
    2.  **Stream Dashboard:** A list of active incoming/outgoing streams.
    3.  **Creation Flow:** A simple but powerful form to start a new stream.
    4.  **Withdrawal:** Instant claiming of accrued funds.

---

## 2. Technical Stack Requirements

- **Framework:** React 18+ (Vite)
- **Language:** TypeScript
- **Styling:** **Tailwind CSS** (We want to migrate from vanilla CSS to Tailwind for better maintainability and modern effects).
- **Animations:** Framer Motion (Crucial for the "live" feel).
- **Icons:** Lucide React or Heroicons.
- **State Management:** React Query (TanStack Query) for data fetching.

---

## 3. Detailed Component Requirements (How to Upgrade)

### A. The "Cosmic" Layout (`Layout.tsx`)
- **Current:** Simple header and footer.
- **Upgrade:**
    - **Background:** A subtle, animated mesh gradient or particle effect in the deep background. It should feel "alive" but not distracting.
    - **Sidebar/Navigation:** A glass-morphic vertical sidebar on the left. Collapsible. Icons for "Dashboard", "Streams", "Wallet", "Settings".
    - **Header:** Minimalist. Shows the current "Network Status" (Connected to Conway Testnet) with a pulsing green dot. Displays the user's connected wallet address (truncated) with a "Copy" interaction.

### B. The "Money Reactor" (LiveCounter.tsx) - **CRITICAL**
This is the showstopper. It must look like a fusion reactor core.
- **Current:** Simple text with a small animation.
- **Upgrade:**
    - **Visuals:** A large, central card. Glass background with a faint electric border.
    - **The Number:** The balance should be HUGE (e.g., `text-6xl`).
    - **Animation:**
        - The last few decimal places (micro-cents) should blur or scroll rapidly like a slot machine or high-frequency ticker.
        - Use `Framer Motion` to animate the value smoothly.
    - **Context:** Below the main number, show "Earning Rate": e.g., "+$0.0002 / sec" in a glowing neon green.
    - **Graph:** A small, real-time sparkline chart background that updates as money flows in.

### C. The "Stream Command Center" (Dashboard)
- **Current:** Basic list of cards.
- **Upgrade:**
    - **Active Streams Grid:** A grid of cards representing active streams.
    - **Card Design:**
        - Dark glass background.
        - Progress bar: A visual bar filling up from 0% to 100% (if finite duration) or a flowing "wave" animation (if infinite).
        - **Avatars:** Generated gradients for Sender/Recipient addresses.
        - **Actions:** A "Withdraw" button that glows when funds are available. Hovering over it should intensify the glow.

### D. The "Initiator" (CreateStreamModal.tsx)
- **Current:** A simple form on the main page.
- **Upgrade:**
    - **Trigger:** A floating action button (FAB) or a prominent "New Stream" button.
    - **Modal:** Opens with a backdrop blur.
    - **Form Fields:**
        - **Recipient:** Input with address validation visual cues.
        - **Rate:** A slider + input combo. As you adjust the rate, show a real-time calculation: "This is ~$5,000 / month".
        - **Token Selector:** Dropdown (default to SPT - StreamPay Token).
    - **Submit Button:** "Start Stream". On click, it should trigger a "sending" animation (e.g., a beam of light traveling from left to right).

---

## 4. Specific "Wow" Factors to Implement

1.  **The "Electric Border"**: All cards should have a subtle 1px border that occasionally "shines" or travels around the edge, implying energy flow.
2.  **Hover Effects**: Buttons shouldn't just change color. They should lift, glow, or ripple.
3.  **Skeleton Loading**: When data is fetching, use shimmering glass skeletons, not just gray boxes.
4.  **Sound Design (Optional code)**: If possible, suggest where to add subtle "click" or "success" sounds (like a sci-fi interface).

---

## 5. Code Structure & Quality

Please provide the code in a modular way:
1.  `tailwind.config.js`: Define the custom colors (Neon Green, Deep Void, etc.) and animations.
2.  `index.css`: Global styles for the background mesh and fonts (Inter or Rajdhani).
3.  `LiveCounter.tsx`: The full animated component.
4.  `StreamCard.tsx`: The individual stream component.
5.  `App.tsx`: The main layout assembly.

**Constraint:** The code must be copy-paste ready. Use dummy data for the preview so I can see it working immediately.

---

## 6. Inspiration References

- **Linear.app**: For the keyboard-centric, fast interactions.
- **Reflex.dev**: For the dark mode aesthetic.
- **Bloomberg Terminal**: For the data density and seriousness.
- **Cyberpunk 2077 UI**: For the neon accents and "glitch" effects (used sparingly).

**GOAL:** When a user opens this app, they should feel like they are operating a high-frequency trading desk in the year 2077. Money is data, and data is beautiful.

**Generate the code now.**
