# Design system

The crowdfunded Berlin was drawn as curved wood. The one that shipped was a white box. The app gives the curve back: warm bent-plywood surfaces, cream paper, and one green thing to touch.

Code: [`app/src/ui/tokens.ts`](../app/src/ui/tokens.ts). Change a value there, not in a screen.

## Color

| Token | Hex | Use |
|---|---|---|
| `cream` | `#F6EFE3` | App background, text on dark |
| `paper` | `#EADFCB` | Sheets' inner cards, chips, the summary line |
| `oak` | `#C99B66` | Wood surfaces: the header shell, the machine |
| `oakLight` | `#D9B485` | Highlight side of wood |
| `walnut` | `#5B3A26` | Grain lines, shadow side of wood |
| `espresso` | `#2A1B12` | Primary text (14.5:1 on cream) |
| `bark` | `#6B5444` | Secondary text (6.2:1 on cream) |
| `verde` | `#17703D` | The primary button and the one accent. White on it is 6.1:1 |
| `verdeDeep` | `#0F5A30` | The primary button while waiting for a card |
| `verdePop` | `#7BE495` | Success moment and screenshots only. Never text on cream |
| `ember` | `#A6402A` | Errors, care cards, hold-to-confirm |

The greens are proposals until colour-matched to a photo of the original packaging.

## Shape, type, touch

| | Value |
|---|---|
| Radius | 28 for sheets and cards, 20 for chips, full pill for buttons. Nothing under 16 |
| Display | Fraunces ExtraBold 800 (hero 40, title 32), SemiBold 600 for sheet titles (26). Bundled, SIL Open Font License |
| Body | System font: 17 body, 15 secondary, 13 caption |
| Touch | 56 minimum. The main button is 96 tall |
| Shadow | Warm walnut, low and soft. No glass, no blur |
| Grain | Drawn in code (`Grain.tsx`): long soft curves at 6 to 10 percent opacity, large surfaces only |

## Pieces

| Component | File | Notes |
|---|---|---|
| `PressScale` | `ui/Pressable.tsx` | Every tappable thing. Scales to 0.97 in 120 ms |
| `HoldButton` | `ui/HoldButton.tsx` | About 1 s hold with a filling bar. For care cards, single-use cards and replacing a working card |
| `Sheet` | `ui/Sheet.tsx` | Bottom sheet on cream, handle, Done in green |
| `Machine` | `ui/Machine.tsx` | Our own curved-wood roaster drawing. About sheet, empty states, screenshots |
| `Airdrop` | `ui/Airdrop.tsx` | Cargo plane drops a bean pouch by parachute. 1.2 s, once, tap to skip, still under Reduce Motion |
| `Grain` | `ui/Grain.tsx` | The plywood grain overlay |

## Motion

| Moment | Animation | Budget |
|---|---|---|
| Tap | Scale to 0.97 and back | 120 ms |
| Sheet | Slide up | system |
| Waiting for a card | Slow pulse on the button | 1.4 s loop |
| Success | Plane crosses, pouch drops, check | 1.2 s, once |
| Error | One small shake | 250 ms |

Honour Reduce Motion. Nothing animates while someone is reading. Nothing blocks input.

## Never

- No onboarding, tour, tabs or settings screen. One screen and sheets.
- No jargon on the surface. Checksums live under "Card details".
- No Bonaverde logo or product photo. The name appears only to say which machine the app works with.
- No "AI" in any copy. No em dashes in any string.
- No matte black or copper. That was the first version's look, retired.
