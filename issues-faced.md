# Issues Faced

---

## 1st Issue: `npm install` Failing Due to Premium GSAP Packages

### Problem

Running `npm install` failed with the following error:

```
npm error code ETIMEDOUT
npm error network request to https://npm.greensock.com/@gsap%2freact/-/react-2.1.1.tgz failed,
reason: connect ETIMEDOUT 104.131.8.206:443
```

The install process could not connect to `npm.greensock.com` (GSAP's private npm registry) and timed out. This caused the **entire** `npm install` to fail — no packages were installed at all, not just the GSAP ones.

Additionally, there were **EPERM (permission denied)** errors when npm tried to clean up `node_modules` directories, likely caused by **OneDrive** locking the files during sync.

### Root Cause

The project's `package.json` included **3 premium/paid GSAP packages** that are hosted on GSAP's private registry (`npm.greensock.com`), not the public npm registry (`registry.npmjs.org`):

| Package | Version | Type |
|---------|---------|------|
| `@gsap/react` | ^2.1.1 | Premium — GSAP React hook |
| `gsap-trial` | ^3.12.7 | Premium — Trial version with premium plugins |
| `gsap` | ^3.12.7 | **Free** — Core GSAP (this was fine) |

To download from `npm.greensock.com`, you need:
1. A **paid GSAP Club/Business license**
2. An **auth token** configured in a `.npmrc` file

The project had **neither** — no `.npmrc` file existed, and no auth token was configured. So npm tried to connect to the private server, got no response, and timed out after waiting.

### Files That Caused the Issue

#### File: `package.json` (Lines 13 and 22)

```json
// Line 13 — Premium package, requires paid registry
"@gsap/react": "^2.1.1",

// Line 22 — Premium trial package, requires paid registry
"gsap-trial": "^3.12.7",
```

These two lines told npm to download packages from GSAP's private server, which was unreachable without authentication.

#### File: `src/components/Work.tsx` (Line 5 and 7)

```tsx
// Line 5 — Importing from premium @gsap/react package
import { useGSAP } from "@gsap/react";

// Line 7 — Registering the premium plugin
gsap.registerPlugin(useGSAP);
```

#### File: `src/components/Navbar.tsx` (Line 5 and 8-9)

```tsx
// Line 5 — Importing ScrollSmoother from premium gsap-trial
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";

// Line 8 — Registering premium plugins
gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
// Line 9 — Exporting a ScrollSmoother instance
export let smoother: ScrollSmoother;
```

#### File: `src/components/utils/splitText.ts` (Lines 3-4 and 11)

```tsx
// Lines 3-4 — Importing premium plugins
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { SplitText } from "gsap-trial/SplitText";

// Line 11 — Registering premium plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
```

#### File: `src/components/utils/initialFX.ts` (Line 1)

```tsx
// Line 1 — Importing SplitText from premium gsap-trial
import { SplitText } from "gsap-trial/SplitText";
```

---

### How It Was Solved

#### Step 1: Removed premium packages from `package.json`

Removed these two lines:
```diff
- "@gsap/react": "^2.1.1",
- "gsap-trial": "^3.12.7",
```

The free `gsap` package (with ScrollTrigger) remained — it installs from the public npm registry and needs no auth.

#### Step 2: Created `src/components/utils/CustomSplitText.ts` (New File)

Built a **custom lightweight SplitText class** to replace GSAP's premium `SplitText` plugin. This class:
- Takes a text element and splits its content into individual `<div>` wrappers for chars, words, and lines
- Supports the same API: `.chars`, `.words`, `.lines` arrays and `.revert()` method
- Works with all the same GSAP animation code without changes

#### Step 3: Updated `src/components/Work.tsx` (Lines 5 and 10)

```diff
- import { useGSAP } from "@gsap/react";
+ import { useEffect } from "react";

- gsap.registerPlugin(useGSAP);
+ gsap.registerPlugin(ScrollTrigger);

- useGSAP(() => {
+ useEffect(() => {
```

#### Step 4: Updated `src/components/Navbar.tsx` (Lines 5-9, 13-21, 34, 39)

Replaced `ScrollSmoother` with a **lightweight custom smoother object** that:
- Uses CSS `scroll-behavior: smooth` for smooth page scrolling
- Provides the same API (`scrollTop()`, `paused()`, `scrollTo()`) so other files that import `smoother` don't break
- Uses `ScrollTrigger.refresh()` instead of `ScrollSmoother.refresh()`

```diff
- import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
- gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
- export let smoother: ScrollSmoother;
+ gsap.registerPlugin(ScrollTrigger);
+ export const smoother = { /* lightweight replacement object */ };
```

#### Step 5: Updated `src/components/utils/splitText.ts` (Lines 3-4, 11)

```diff
- import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
- import { SplitText } from "gsap-trial/SplitText";
- gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
+ import { SplitText } from "./CustomSplitText";
+ gsap.registerPlugin(ScrollTrigger);
```

#### Step 6: Updated `src/components/utils/initialFX.ts` (Line 1)

```diff
- import { SplitText } from "gsap-trial/SplitText";
+ import { SplitText } from "./CustomSplitText";
```

#### Step 7: Clean install

Deleted `node_modules/` and `package-lock.json`, then ran `npm install` — completed successfully with 257 packages.

---

### Why This Solution?

1. **Why not just add an `.npmrc` with auth?**
   - You would need a **paid GSAP license** ($99-$250/year) to get an auth token. The premium plugins (SplitText, ScrollSmoother) are not available for free.

2. **Why replace `useGSAP` with `useEffect`?**
   - `useGSAP` is just a thin React wrapper around `useEffect`/`useLayoutEffect` that handles GSAP animation cleanup. For this use case, React's built-in `useEffect` does the exact same job. There's no functional difference.

3. **Why create a custom `SplitText` instead of using another library?**
   - No good free alternative exists that matches GSAP's SplitText API exactly. Writing a custom one (120 lines) ensures **zero changes** to the animation code in `splitText.ts` and `initialFX.ts` — same `.chars`, `.words`, `.lines` arrays and `.revert()` method.

4. **Why replace `ScrollSmoother` with CSS smooth scrolling?**
   - `ScrollSmoother` is GSAP's most premium plugin. It creates buttery smooth scrolling by wrapping your page content. However, modern CSS `scroll-behavior: smooth` achieves a similar effect natively. A lightweight API-compatible object was created so `initialFX.ts` (which imports `smoother`) doesn't break.

5. **Why delete `node_modules` and `package-lock.json` before reinstalling?**
   - The old `package-lock.json` still referenced the premium packages and their registry URLs. A clean install ensures npm generates a fresh lock file with only public packages. The old `node_modules` had EPERM-locked files from OneDrive, so deleting it avoids conflicts.

### Logic Behind the Solution

The core logic was: **replace premium dependencies with free equivalents that expose the same API**, so the existing animation code requires minimal changes.

```
Premium Package → Free Replacement → Same API = Minimal Code Changes
```

- `@gsap/react` → `useEffect` (built into React, same behavior)
- `gsap-trial/SplitText` → `CustomSplitText.ts` (same `.chars`, `.words`, `.lines`, `.revert()`)
- `gsap-trial/ScrollSmoother` → Custom smoother object + CSS (same `.scrollTop()`, `.paused()`, `.scrollTo()`)

This approach ensures the project installs from the **public npm registry only**, requires **no paid licenses**, and keeps the **existing animation behavior** as close to the original as possible.
