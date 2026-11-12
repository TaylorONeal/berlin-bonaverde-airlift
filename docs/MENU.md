# The menu, translated

## The product problem

Bonaverde sold profiles as products: a pouch of *Ricardo Tavares / Brazil* or *Flor de Corazon / Mexico*, bought in its marketplace, with the card glued to the bag. That marketplace is gone. Nobody ordering green coffee today (from Sweet Maria's, a local roaster, a co-op, Amazon) has "a Tavares" in the cupboard. Shipping a 2026 app whose main screen is a museum of dead SKUs would be nostalgia, not product.

So the app speaks in what you are doing: **pot size, roast level, timing, and what is in the machine.** The original profile behind every menu item is named once, small, in the app ("Original card: ..."), and mapped completely here.

## What the data actually says (checked, not vibes)

We decoded all 33 VerdeNFC templates byte by byte before designing this:

- **The grower Roast·Grind·Brew cards are near-identical curves.** All 13 share the same roast-phase structure; they differ mainly in batch size (50 g vs 80 g), small timing bytes, and one (Alfaro) in the grind record. Selling them in 2026 as thirteen different coffees would be a lie the original marketing already told once.
- **The "Universal" roast series is the honest generic product.** Light / Medium / Dark genuinely differ: light is gentler and shortest, dark runs longest, exactly as labelled. The 80 g universal covers batch roasting.
- **Grind & Brew and Brew were always generic.** Two pot sizes, two brew heats. They just needed today's words.
- **The named single-origin roast cards** (Postcard, The Wave, Flash Pump, Ojo de Aqua, Monpaka, and the roast versions of the grower cards) sit between medium and dark in their timing/power envelopes. They are preserved in code and in the archive table below, and any physical card can still be read and cloned, but they do not headline a menu for beans you cannot buy.

## The menu (what the app shows)

### Full journey: green beans in, coffee out (Roast · Grind · Brew)

| App menu | Means today | Original card (VerdeNFC id) |
|---|---|---|
| **Full Pot** · 80 g · 900 ml · balanced | The everyday default, any modern green beans | Tavares / Brazil 80 g (2) |
| **Half Pot** · 50 g · 600 ml · balanced | One or two people, no waste | Tavares / Brazil 50 g (1) |
| **Overnight** · brews in 10 h | Roast tonight, wake to brewed coffee; sets the pause automatically | Tavares Night (12) |

### Roast only: beans for later or another brewer

| App menu | Means today | Original card (VerdeNFC id) |
|---|---|---|
| **Light Roast** · 50 g | Delicate beans: Ethiopia, Kenya, washed high-altitude | Universal, light (41) |
| **Medium Roast** · 50 g | The default all-rounder | Universal, medium (42) |
| **Dark Roast** · 50 g | Brazil, Sumatra, decaf; milk drinks | Universal, dark (43) |
| **Full Batch** · 80 g medium | A week's beans in one roast | Universal 80 g / 1 L (44b) |

### Already-roasted beans

| App menu | Means today | Original card (VerdeNFC id) |
|---|---|---|
| **Full Pot** · Grind & Brew 80 g | Bought-roasted whole beans, full pot | Grind & Brew 80 g (82) |
| **Half Pot** · Grind & Brew 20-50 g | Smaller pot of roasted beans | Grind & Brew 20/50 g (81) |
| **Grind Only** | The Berlin as a grinder | Grind only (85) |
| **Hot Brew** | Ground coffee, full heat | Brew only 90C (84) |
| **Gentle Brew** | Ground coffee, lower heat | Brew only 70C (83) |

### Maintenance (words were already honest)

Reset air filter counter (99), Clean grinder (98), Descale (97). Unchanged.

## The archive: every other original, and its closest modern use

Preserved in `app/src/protocol/profiles.ts`, readable and copyable with **What's on this card?**:

| Original card | Id | Closest menu item today |
|---|---|---|
| Flor de Corazon / Mexico 55 g and 80 g | 3, 4 | Half Pot / Full Pot |
| Ocean College / Costa Rica 84 g | 5 | Full Pot |
| Luis Alberto / Nicaragua 80 g | 6 | Full Pot |
| Alfaro Family / El Salvador 80 g | 7 | Full Pot (its grind record runs longer) |
| Surprise 1 80 g | 8 | Full Pot |
| Wallace Family / Colombia 50 g and 80 g (+ alt) | 9, 10, 11 | Half Pot / Full Pot |
| Coffee Changer Badge | 13 | None. It was a membership artifact, not a coffee. Archived for history. |
| Roast: Alfaro Family 80 g | 44 | Full Batch |
| Roast: Postcard, The Wave, Monpaka, Flor de Corazon, Ricardo Tavares | 45, 46, 49, 50, 51 | Medium to Dark Roast |
| Roast: Flash Pump, Ojo de Aqua | 47, 48 | Dark Roast (their stat byte runs long, 60 min) |

## A note on honesty

Roast "levels" here are the community's own labels for the universal series, and pot sizes are the sizes the cards were built for. We do not claim a curve tastes like a specific farm in 2026, because it does not, and it never really did. What the cards reliably control is the machine's heat, power, timing and grind behaviour, and the menu names exactly that, in the words a person would use in their own kitchen.
