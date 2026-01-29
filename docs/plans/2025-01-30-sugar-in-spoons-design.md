# Sugar in Spoons - Design Document

## Overview
A simple sugar translation tool that converts grams to spoons (and vice versa) with personality. Not a nutrition app - a unit translator that makes sugar quantities emotionally resonant.

**Core Flow:** Input grams → Output spoons + witty reaction

## Visual Style
- **Theme:** Playful cartoon with bright colors and emoji-heavy design
- **Background:** Pink-to-orange gradient (evokes sweetness)
- **Card:** White, rounded corners (24px), subtle shadow
- **Typography:** Clean, large numbers, friendly but readable

## UI Components

### Main Card Structure
```
┌─────────────────────────────────────┐
│     Sugar in Spoons 🥄              │
│  Because '20 grams' means nothing   │
│                                     │
│  [   grams input   ] [ + stepper ]  │
│                                     │
│  ( Teaspoons | Tablespoons )        │
│                                     │
│  [ OUTPUT - hidden until input ]    │
│  ┌───────────────────────────────┐  │
│  │     5                         │  │
│  │  🥄🥄🥄🥄🥄                   │  │
│  │  Your pancreas sends regards  │  │
│  └───────────────────────────────┘  │
│                                     │
│  WHO says max 6 tsp/day             │
│  [↔ Flip] [🇺🇸 Country]             │
└─────────────────────────────────────┘
```

### Input Section
- **Number input:** Large, prominent, no label needed (grams implied)
- **Stepper button:** (+) for quick 5g increments
- **Unit toggle:** Pill-shaped, teaspoons (default) / tablespoons

### Output Section (appears after input)
- **Giant number:** Spoon count in bright accent color
- **Spoon emojis:** Visual representation, capped at 12 (shows "12+..." if more)
- **Witty one-liner:** Random comment based on severity tier
- **WHO guideline:** Subtle gray text, optional

### Reverse Mode
- **Toggle:** "↔ Flip" button swaps input/output
- **Flow:** Input spoons → Output grams
- **Same personality:** One-liners work both ways

### Country Selector
- **Options:** US (4.2g/tsp), UK/Australia (5g/tsp)
- **Stored:** Remembered in localStorage
- **Default:** US

## Humor System

### One-Liner Tiers (based on teaspoon count)

**Tier 1: 0-3 tsp**
- "That's practically health food 🌿"
- "Your pancreas sends its regards"
- "Baby's first sugar rush"
- "This is fine. This is totally fine."

**Tier 2: 4-6 tsp**
- "That's... a choice."
- "Your pancreas is filing a complaint"
- "That's not coffee, that's dessert"
- "Sleep is for people who don't do this"

**Tier 3: 7-10 tsp**
- "Are you okay?"
- "That's a dessert pretending to be a beverage"
- "Wow. Just... wow."
- "Your pancreas just quit"
- "That's not sugar, that's a lifestyle"

**Tier 4: 11+ tsp**
- "Your pancreas has left the chat"
- "That's not a drink, that's a science experiment"
- "Absolutely unhinged behavior"
- "I'm not judging. (Yes I am)"
- "Bold of you to assume you'll sleep tonight"
- "That's a lot. That's so many spoons."

## Edge Cases

| Input | Response |
|-------|----------|
| Negative | "Sugar subtracts itself? Try again" |
| Zero | "That's zero spoons. You have successfully avoided sugar." |
| Empty | Show nothing (clean state) |

## Technical Notes

### Conversion Math
- **US:** 1 tsp = 4.2g, 1 tbsp = 3 tsp = 12.6g
- **UK/AU:** 1 tsp = 5g, 1 tbsp = 3 tsp = 15g

### Persistence
- Remember unit preference (tsp/tbsp) in localStorage
- Remember country preference in localStorage
- No accounts, no tracking

### Mobile
- Spoon emojis wrap gracefully
- Card padding adapts to screen size
- No scrolling needed

## Success Criteria
- Instant feedback (no latency)
- Clear visual hierarchy
- Shareable (screenshot-worthy moments)
- Emotionally sticky: "Holy shit, is that really how much?"
