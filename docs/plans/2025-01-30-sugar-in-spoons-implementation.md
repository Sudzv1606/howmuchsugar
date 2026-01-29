# Sugar in Spoons Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page sugar grams-to-spoons converter with witty one-liner reactions

**Architecture:** Plain HTML/CSS/JS - no build step, no framework. Single card UI with gradient background, localStorage for preferences, simple conversion math.

**Tech Stack:** Vanilla JavaScript, CSS3, HTML5

---

## Task 1: Project Structure

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Create: `one-liners.js`

**Step 1: Create base HTML structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sugar in Spoons - Because '20 grams' means nothing</title>
    <meta property="og:title" content="Sugar in Spoons">
    <meta property="og:description" content="See how much sugar is actually in your food. In spoons.">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="gradient-bg">
        <main class="card">
            <h1>Sugar in Spoons <span class="emoji">🥄</span></h1>
            <p class="subtitle">Because '20 grams' means nothing</p>

            <div class="input-section">
                <input type="number" id="sugarInput" placeholder="Enter grams" min="0" step="1">
                <button id="stepperBtn" class="stepper">+</button>
            </div>

            <div class="toggle-section">
                <div class="unit-toggle">
                    <button class="toggle-btn active" data-unit="tsp">Teaspoons</button>
                    <button class="toggle-btn" data-unit="tbsp">Tablespoons</button>
                </div>
            </div>

            <div id="outputSection" class="output-section hidden">
                <div class="spoon-count" id="spoonCount">5</div>
                <div class="spoon-emojis" id="spoonEmojis">🥄🥄🥄🥄🥄</div>
                <div class="one-liner" id="oneLiner">Your pancreas sends its regards</div>
                <div class="who-guideline">WHO says max 6 tsp/day</div>
            </div>

            <div class="extras-section">
                <button id="flipBtn" class="icon-btn" title="Reverse mode">↔ Flip</button>
                <select id="countrySelect" class="country-select">
                    <option value="us">🇺🇸 US (4.2g/tsp)</option>
                    <option value="uk">🇬🇧 UK/AU (5g/tsp)</option>
                </select>
            </div>
        </main>
    </div>
    <script src="one-liners.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

**Step 2: Verify HTML structure**

Open: `index.html` in browser
Expected: Basic unstyled page with all elements visible

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add base HTML structure"
```

---

## Task 2: One-Liner System

**Files:**
- Create: `one-liners.js`

**Step 1: Write the one-liners data structure**

```javascript
const ONE_LINERS = {
    tier1: [ // 0-3 tsp
        "That's practically health food 🌿",
        "Your pancreas sends its regards",
        "Baby's first sugar rush",
        "This is fine. This is totally fine."
    ],
    tier2: [ // 4-6 tsp
        "That's... a choice.",
        "Your pancreas is filing a complaint",
        "That's not coffee, that's dessert",
        "Sleep is for people who don't do this"
    ],
    tier3: [ // 7-10 tsp
        "Are you okay?",
        "That's a dessert pretending to be a beverage",
        "Wow. Just... wow.",
        "Your pancreas just quit",
        "That's not sugar, that's a lifestyle"
    ],
    tier4: [ // 11+ tsp
        "Your pancreas has left the chat",
        "That's not a drink, that's a science experiment",
        "Absolutely unhinged behavior",
        "I'm not judging. (Yes I am)",
        "Bold of you to assume you'll sleep tonight",
        "That's a lot. That's so many spoons."
    ],
    special: {
        negative: "Sugar subtracts itself? Try again",
        zero: "That's zero spoons. You have successfully avoided sugar."
    }
};

function getOneLiner(teaspoons) {
    if (teaspoons < 0) return ONE_LINERS.special.negative;
    if (teaspoons === 0) return ONE_LINERS.special.zero;

    const tier = teaspoons <= 3 ? 'tier1' :
                 teaspoons <= 6 ? 'tier2' :
                 teaspoons <= 10 ? 'tier3' : 'tier4';

    const tierLines = ONE_LINERS[tier];
    return tierLines[Math.floor(Math.random() * tierLines.length)];
}
```

**Step 2: Verify one-liner system**

Add temporary test to bottom of `one-liners.js`:
```javascript
// Test
console.log(getOneLiner(-1)); // negative
console.log(getOneLiner(0));  // zero
console.log(getOneLiner(2));  // tier1
console.log(getOneLiner(5));  // tier2
console.log(getOneLiner(8));  // tier3
console.log(getOneLiner(12)); // tier4
```

Open: `index.html` in browser, check console
Expected: Each console.log shows appropriate one-liner

**Step 3: Remove test code and commit**

Remove test code from `one-liners.js`

```bash
git add one-liners.js
git commit -m "feat: add one-liner system with tiered reactions"
```

---

## Task 3: Core Application Logic

**Files:**
- Create: `app.js`

**Step 1: Write state management and conversion logic**

```javascript
// State
let state = {
    inputValue: '',
    currentUnit: 'tsp', // 'tsp' or 'tbsp'
    country: 'us', // 'us' or 'uk'
    isReverseMode: false
};

// Conversion factors (grams per spoon)
const CONVERSION = {
    us: { tsp: 4.2, tbsp: 12.6 },
    uk: { tsp: 5.0, tbsp: 15.0 }
};

// DOM Elements
const elements = {
    input: document.getElementById('sugarInput'),
    stepper: document.getElementById('stepperBtn'),
    output: document.getElementById('outputSection'),
    spoonCount: document.getElementById('spoonCount'),
    spoonEmojis: document.getElementById('spoonEmojis'),
    oneLiner: document.getElementById('oneLiner'),
    toggleBtns: document.querySelectorAll('.toggle-btn'),
    flipBtn: document.getElementById('flipBtn'),
    countrySelect: document.getElementById('countrySelect')
};

// Load saved preferences
function loadPreferences() {
    const savedUnit = localStorage.getItem('sugarUnit');
    const savedCountry = localStorage.getItem('sugarCountry');

    if (savedUnit) {
        state.currentUnit = savedUnit;
        updateUnitToggle();
    }
    if (savedCountry) {
        state.country = savedCountry;
        elements.countrySelect.value = savedCountry;
    }
}

// Save preferences
function savePreferences() {
    localStorage.setItem('sugarUnit', state.currentUnit);
    localStorage.setItem('sugarCountry', state.country);
}

// Convert grams to spoons
function gramsToSpoons(grams, unit, country) {
    const gPerSpoon = CONVERSION[country][unit];
    return Math.round((grams / gPerSpoon) * 10) / 10;
}

// Convert spoons to grams
function spoonsToGrams(spoons, unit, country) {
    const gPerSpoon = CONVERSION[country][unit];
    return Math.round(spoons * gPerSpoon);
}

// Get teaspoon equivalent (for one-liner tiering)
function getTeaspoonEquivalent(inputValue) {
    if (state.isReverseMode) {
        // Input is spoons - convert to teaspoons
        if (state.currentUnit === 'tsp') {
            return inputValue;
        }
        return inputValue * 3; // 1 tbsp = 3 tsp
    } else {
        // Input is grams - convert to teaspoons
        const gPerTsp = CONVERSION[state.country].tsp;
        return inputValue / gPerTsp;
    }
}

// Generate spoon emoji string
function generateSpoonEmojis(count) {
    const maxVisible = 12;
    const displayCount = Math.min(Math.floor(count), maxVisible);
    let emojis = '';
    for (let i = 0; i < displayCount; i++) {
        emojis += '🥄';
    }
    if (count > maxVisible) {
        emojis += ` (+${Math.floor(count - maxVisible)} more)`;
    }
    return emojis;
}

// Update output display
function updateOutput() {
    const value = parseFloat(state.inputValue);

    if (isNaN(value) || state.inputValue === '') {
        elements.output.classList.add('hidden');
        return;
    }

    let outputValue, tspEquivalent;

    if (state.isReverseMode) {
        // Reverse mode: input spoons → output grams
        outputValue = spoonsToGrams(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = `${outputValue}g`;
        tspEquivalent = getTeaspoonEquivalent(value);
    } else {
        // Normal mode: input grams → output spoons
        outputValue = gramsToSpoons(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = outputValue;
        elements.spoonEmojis.textContent = generateSpoonEmojis(outputValue);
        tspEquivalent = getTeaspoonEquivalent(value);
    }

    elements.oneLiner.textContent = getOneLiner(tspEquivalent);
    elements.output.classList.remove('hidden');
}

// Update unit toggle visual state
function updateUnitToggle() {
    elements.toggleBtns.forEach(btn => {
        if (btn.dataset.unit === state.currentUnit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
```

**Step 2: Verify core logic loads**

Add temporary test to bottom of `app.js`:
```javascript
// Test conversions
console.log('10g in US tsp:', gramsToSpoons(10, 'tsp', 'us')); // ~2.4
console.log('10g in UK tsp:', gramsToSpoons(10, 'tsp', 'uk')); // 2
console.log('5 tsp to grams (US):', spoonsToGrams(5, 'tsp', 'us')); // 21
```

Open: `index.html` in browser, check console
Expected: Correct conversion values logged

**Step 3: Remove test code**

Remove test code from `app.js`

**Step 4: Commit**

```bash
git add app.js
git commit -m "feat: add core conversion logic and state management"
```

---

## Task 4: Event Handlers

**Files:**
- Modify: `app.js` (append to end)

**Step 1: Add all event listeners**

```javascript
// Add at the end of app.js, after the existing code

// Input change handler
elements.input.addEventListener('input', (e) => {
    state.inputValue = e.target.value;
    updateOutput();
});

// Stepper button (+5g or +1 spoon)
elements.stepper.addEventListener('click', () => {
    const current = parseFloat(state.inputValue) || 0;
    const increment = state.isReverseMode ? 1 : 5;
    state.inputValue = (current + increment).toString();
    elements.input.value = state.inputValue;
    updateOutput();
});

// Unit toggle handlers
elements.toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        state.currentUnit = btn.dataset.unit;
        updateUnitToggle();
        savePreferences();
        updateOutput();
    });
});

// Country selector
elements.countrySelect.addEventListener('change', (e) => {
    state.country = e.target.value;
    savePreferences();
    updateOutput();
});

// Flip mode button
elements.flipBtn.addEventListener('click', () => {
    state.isReverseMode = !state.isReverseMode;

    // Update UI for mode
    if (state.isReverseMode) {
        elements.input.placeholder = `Enter ${state.currentUnit}`;
        document.querySelector('.subtitle').textContent = 'Because grams are confusing';
    } else {
        elements.input.placeholder = 'Enter grams';
        document.querySelector('.subtitle').textContent = "Because '20 grams' means nothing";
    }

    // Clear and refocus
    state.inputValue = '';
    elements.input.value = '';
    elements.output.classList.add('hidden');
    elements.input.focus();
});

// Initialize
loadPreferences();
updateUnitToggle();
elements.input.focus();
```

**Step 2: Verify all interactions work**

Open: `index.html` in browser

Test each interaction:
1. Type "20" in input → Should show ~4.8 tsp + one-liner
2. Click "+" button → Should add 5g and update
3. Click "Tablespoons" → Should show ~1.6 tbsp
4. Change country to UK → Should show 4 tsp
5. Click "↔ Flip" → Placeholder changes, clear input
6. Enter "5" in reverse mode → Should show "21g" (US) or "25g" (UK)
7. Reload page → Unit and country preferences remembered

**Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add event handlers and user interactions"
```

---

## Task 5: Styling

**Files:**
- Create: `styles.css`

**Step 1: Write complete stylesheet**

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

/* Gradient background */
.gradient-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
    z-index: -1;
}

/* Main card */
.card {
    background: white;
    border-radius: 24px;
    padding: 40px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* Header */
h1 {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
    color: #1a1a1a;
}

.emoji {
    font-size: 28px;
}

.subtitle {
    text-align: center;
    color: #666;
    font-size: 14px;
    margin-bottom: 32px;
}

/* Input section */
.input-section {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}

#sugarInput {
    flex: 1;
    font-size: 24px;
    font-weight: 600;
    padding: 16px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 16px;
    outline: none;
    transition: border-color 0.2s;
}

#sugarInput:focus {
    border-color: #ff6b6b;
}

.stepper {
    font-size: 28px;
    font-weight: 600;
    padding: 0 24px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.1s, background 0.2s;
}

.stepper:hover {
    background: #ff5252;
}

.stepper:active {
    transform: scale(0.95);
}

/* Unit toggle */
.toggle-section {
    margin-bottom: 24px;
}

.unit-toggle {
    display: flex;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 4px;
}

.toggle-btn {
    flex: 1;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    background: transparent;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    color: #666;
    transition: all 0.2s;
}

.toggle-btn.active {
    background: white;
    color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover:not(.active) {
    color: #1a1a1a;
}

/* Output section */
.output-section {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    border-radius: 20px;
    padding: 28px;
    text-align: center;
    margin-bottom: 24px;
    transition: opacity 0.3s, transform 0.3s;
}

.output-section.hidden {
    display: none;
}

.spoon-count {
    font-size: 56px;
    font-weight: 800;
    color: #d63031;
    margin-bottom: 12px;
}

.spoon-emojis {
    font-size: 32px;
    margin-bottom: 16px;
    word-break: break-all;
    line-height: 1.4;
}

.one-liner {
    font-size: 18px;
    font-weight: 600;
    color: #2d3436;
    margin-bottom: 12px;
}

.who-guideline {
    font-size: 12px;
    color: #636e72;
    font-weight: 500;
}

/* Extras section */
.extras-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.icon-btn {
    font-size: 16px;
    padding: 10px 16px;
    background: #f5f5f5;
    color: #666;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.icon-btn:hover {
    background: #e0e0e0;
    color: #1a1a1a;
}

.country-select {
    font-size: 14px;
    padding: 10px 14px;
    background: #f5f5f5;
    color: #1a1a1a;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    outline: none;
}

.country-select:hover {
    background: #e0e0e0;
}

/* Mobile responsive */
@media (max-width: 480px) {
    .card {
        padding: 28px 20px;
    }

    h1 {
        font-size: 24px;
    }

    .spoon-count {
        font-size: 48px;
    }

    .spoon-emojis {
        font-size: 28px;
    }

    .one-liner {
        font-size: 16px;
    }

    .extras-section {
        flex-direction: column;
    }

    .icon-btn, .country-select {
        width: 100%;
    }
}
```

**Step 2: Verify styling**

Open: `index.html` in browser
Expected:
- Pink/orange gradient background
- Clean white card with shadow
- All elements properly styled
- Mobile responsive (resize window to test)

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add complete styling with responsive design"
```

---

## Task 6: Final Polish & Edge Cases

**Files:**
- Modify: `app.js` (update updateOutput function)

**Step 1: Add special case handling for negative/zero**

Find and replace the `updateOutput()` function with this enhanced version:

```javascript
function updateOutput() {
    const value = parseFloat(state.inputValue);

    if (isNaN(value) || state.inputValue === '') {
        elements.output.classList.add('hidden');
        return;
    }

    // Special cases
    if (value < 0) {
        elements.spoonCount.textContent = '🤨';
        elements.spoonEmojis.textContent = '';
        elements.oneLiner.textContent = getOneLiner(-1);
        elements.output.classList.remove('hidden');
        return;
    }

    if (value === 0) {
        elements.spoonCount.textContent = '0';
        elements.spoonEmojis.textContent = '✨';
        elements.oneLiner.textContent = getOneLiner(0);
        elements.output.classList.remove('hidden');
        return;
    }

    let outputValue, tspEquivalent;

    if (state.isReverseMode) {
        // Reverse mode: input spoons → output grams
        outputValue = spoonsToGrams(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = `${outputValue}g`;
        tspEquivalent = getTeaspoonEquivalent(value);
    } else {
        // Normal mode: input grams → output spoons
        outputValue = gramsToSpoons(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = outputValue;
        elements.spoonEmojis.textContent = generateSpoonEmojis(outputValue);
        tspEquivalent = getTeaspoonEquivalent(value);
    }

    elements.oneLiner.textContent = getOneLiner(tspEquivalent);
    elements.output.classList.remove('hidden');
}
```

**Step 2: Test edge cases**

Open: `index.html` in browser

Test:
1. Enter "-5" → Should show "🤨" + negative one-liner
2. Enter "0" → Should show "0" + "✨" + zero one-liner
3. Enter very large number like "200" → Should show "12+..." in emojis
4. Clear input → Output should hide

**Step 3: Add favicon and meta polish**

Update `<head>` in `index.html`:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sugar in Spoons 🥄 - Because '20 grams' means nothing</title>
    <meta name="description" content="See how much sugar is actually in your food. Convert grams to teaspoons and tablespoons.">
    <meta property="og:title" content="Sugar in Spoons 🥄">
    <meta property="og:description" content="20 grams of sugar = 5 teaspoons. See it to believe it.">
    <meta property="og:type" content="website">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥄</text></svg>">
    <link rel="stylesheet" href="styles.css">
</head>
```

**Step 4: Commit**

```bash
git add index.html app.js
git commit -m "feat: add edge case handling and meta polish"
```

---

## Task 7: Testing & Validation

**Files:** (no new files, manual testing)

**Step 1: Complete user flow test**

Open: `index.html` in browser

Test the full user journey:
1. ✅ Page loads, input is focused
2. ✅ Enter "25" → Shows correct US tsp conversion (~6)
3. ✅ Click "+" → Shows "30" → Updated output
4. ✅ Switch to tablespoons → Shows ~2.4 tbsp
5. ✅ Switch to UK country → Shows 6 tsp (exactly)
6. ✅ Click flip mode → Placeholder changes, clears
7. ✅ Enter "3" spoons → Shows "12.6g" (US tbsp)
8. ✅ Enter "0" → Shows zero message
9. ✅ Enter "-5" → Shows error message
10. ✅ Reload page → Preferences remembered

**Step 2: Cross-browser check**

Test in:
- ✅ Chrome/Edge (primary)
- ✅ Firefox
- ✅ Safari (if on Mac)

**Step 3: Mobile check**

Open browser DevTools, toggle mobile view:
- ✅ iPhone SE (375px)
- ✅ Pixel 5 (393px)
- ✅ iPad (768px)

Verify:
- Layout adapts properly
- Spoon emojis wrap gracefully
- All buttons are tappable
- No horizontal scroll

**Step 4: Final commit**

```bash
git add -A
git commit -m "test: validate all user flows and edge cases"
```

---

## Task 8: Deploy

**Files:** (deployment)

**Step 1: Choose deployment method**

Option A: **GitHub Pages** (free, easy)
1. Create GitHub repo
2. Push code
3. Enable Pages in settings
4. Deploy from `main` branch

Option B: **Netlify Drop** (fastest)
1. Go to netlify.com/drop
2. Drag the entire `sugarspoon` folder
3. Get instant URL

Option C: **Vercel** (modern)
1. `npm i -g vercel`
2. `vercel` in project directory
3. Follow prompts

**Step 2: Deploy**

Choose one option and deploy.

**Step 3: Test live deployment**

Visit the deployed URL and verify:
- ✅ Page loads correctly
- ✅ All features work
- ✅ Meta tags appear when sharing (use link preview tool)

**Step 4: Tag release**

```bash
git tag v1.0.0
git push origin main --tags
```

---

## Summary

**Total files created:**
- `index.html` - Main HTML structure
- `styles.css` - Complete styling
- `app.js` - Core application logic
- `one-liners.js` - Humor system
- `docs/plans/2025-01-30-sugar-in-spoons-design.md` - Design doc
- `docs/plans/2025-01-30-sugar-in-spoons-implementation.md` - This file

**Features delivered:**
✅ Grams to spoons conversion (teaspoons/tablespoons)
✅ Reverse mode (spoons to grams)
✅ Country-specific conversions (US/UK)
✅ Tiered witty one-liner reactions
✅ Visual spoon representation
✅ WHO guideline context
✅ localStorage preferences
✅ Edge case handling
✅ Mobile responsive
✅ Zero build step
