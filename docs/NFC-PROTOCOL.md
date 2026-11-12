# The Bonaverde Berlin NFC protocol

Everything here is community reverse engineering, written down so the next person does not have to redo it. Sources: VerdeNFC (btrappe), hackaverde (PostalBlab et al.), and real card dumps published by both. Where a meaning is a work-in-progress guess, it says so.

## The card

- **Chip family:** MIFARE Ultralight EV1, the 80-byte MF0UL11 (20 pages; configuration at pages 16 to 19). This is the card family VerdeNFC dispatches for, and the one community guides tell owners to buy. NTAG21x blanks are a different chip and are not proven on the Berlin. Buying guide: [CARDS.md](CARDS.md).
- **Image size the machine cares about:** 80 bytes = 20 pages × 4 bytes.
- **Scanning on the machine:** hold the card to the reader on the front of the Berlin until it beeps, then press the round button to start. (Manual: support-era instructions mirrored at https://cdn3.guidespdf.com/view/1476/1476873-berlin.pdf )

## Byte map

| Bytes | Pages | Meaning |
|---|---|---|
| 0 to 8 | 0 to 1 (+1 byte of 2) | UID (9 bytes as VerdeNFC prints it) |
| 9 to 11 | 2 | Internal / lock bytes |
| 12 to 15 | 3 | OTP. One-time bits. This page is why original pouches were single-use. |
| 16 to 49 | 4 to 11 (to byte 49) | **The payload.** Four roast-phase records, then the command block. See below. |
| 50 to 59 | 12 (rest) to 14 | Mostly zero on known cards. |
| 60 | 15 | **CRC8**, over bytes 0 to 11 concatenated with 16 to 59 (the OTP page is skipped). |
| 61 to 63 | 15 | Zero on known cards. |
| 64 to 79 | 16 to 19 | Mifare configuration (CFG). Never written by VerdeNFC or by this app. |

### The payload, closer

Following hackaverde's `NFC/Layout.md` and VerdeNFC's decoder (`DataDetails2ViewModel`):

- Bytes 16 to 35: four roast-phase records of 5 bytes each, with a skipped separator byte between records in the decoder's view (records start at 16, 21, 26, 31). The decoder interprets each as two temperatures, a max-power percentage, a power percentage, and (records 2 and 4) a duration in 5-second units. **Treat the temperature reading as approximate**: hackaverde's firmware notes describe these bytes as parameters to a roast-curve function rather than plain temperatures, and VerdeNFC itself labelled its interpretation "WiP".
- Bytes 36 to 39: a fifth record. Byte 37 as a temperature, byte 38 as max-power %, and byte 39 as **grind seconds** when the command is Grind, Grind & Brew or Clean Grinder.
- Byte 40: a value the firmware multiplies by 5 or 10 (hackaverde).
- **Byte 41: the command.** See the table below.
- Byte 42: a time/statistic value the decoder calls `Time_Stat_7`, in minutes.
- Bytes 43 to 45: present in every profile; no confirmed meaning yet.
- **Bytes 46 to 47: CRC16**, little-endian. Two variants exist. See Checksums.
- **Bytes 48 to 49: pause after roasting**, minutes, big-endian. Honoured for command 1 (and 3). This is how the "Tavares Night" card roasts in the evening and brews 10 hours later.

### Commands (byte 41)

| Value | Command |
|---|---|
| `0x01` | Roast · Grind · Brew |
| `0x02` | Roast only |
| `0x03` | (Roast · Grind · Brew variant the decoder groups with 1) |
| `0x04` | Grind only |
| `0x05` | Grind & Brew |
| `0x06` | Brew only |
| `0x0F` | **Reset air filter counter** |
| `0x11` | Set filter usage to 30 (the machine will ask for a new filter) |
| `0x12` | Clean grinder (with special cleaning beans) |
| `0x13` | Maintenance: descale the brewing system |

Firmware validation (hackaverde): byte 41 must be 1 to 6, `0x0F`, `0x12` or `0x13` (plus `0x11` in the "request filter" path) or the scan is rejected.

A German-language firmware note that circulates with the community tag libraries (`command-byte.txt`, "Command byte: Zeile 11, 2. Byte, d.h. 41. Byte ab Beginn") adds the state machine behind the scan: commands 1, 2 and 3 continue to state `0x0c`; 4 and 5 to state 4; 6 to state 1; `0x0F` (filter usage set to 0) to state 9; `0x11` (filter usage set to 30) to state `0x0c`; `0x13` to state 2. Values `0x07` to `0x0E` map through an internal `cmd_45f4` table (0x0F, 0x1D, 0x10, 0x2D, 0x1B, 0x02, 0x15, 0x0A respectively) and continue to state `0x10`, and `0x10` maps to `0x2F`. None of these have confirmed user-visible functions yet, and this app deliberately does not offer them.

## Checksums

Both are ported byte-for-byte from VerdeNFC's `VerdeChecksums.cs` in `nfc/VerdeChecksums.kt`, and both are **verified against real published card dumps** by `tools/verify_checksums.py`.

### CRC16: two variants, and why

```text
single-use:  seed = param[1] * param[2] * 5;  xor param[i] for i in a 23-entry index table (skipping its first 2);  result xor 0xA1
multi-use:   seed = param[0] * param[2] * 5;  xor param[i] for i in its (different) index table (skipping its first 2);  result xor 0xD2
```

- VerdeNFC defaults to **multi-use** (its checkbox defaults on), and so does this app. Original cards exist in both flavours: in hackaverde's published dumps, the air-filter card validates as single-use, while the brew-only and grind-only cards validate as multi-use.
- On a read, this app reports which variant a card carries. On a write, the toggle decides which variant the new card gets.

### CRC8

A table-driven CRC8 (polynomial `0x07` table generation exactly as in VerdeNFC's `Crc8` class), computed over bytes 0 to 11 + 16 to 59 and stored at byte 60. If both it and the CRC16 are zero/mismatched, the firmware refuses the card.

## Writing a card (the VerdeNFC method)

1. Start from a profile template: the 34 payload bytes for offset 16 to 49 (see `app/src/protocol/profiles.ts`; transcribed from VerdeNFC).
2. Read the **destination** card first. Copy its bytes 0 to 15 over the template image. A card always keeps its own identity; this is also what makes the checksums card-specific.
3. Apply the pause (bytes 48 to 49) if the user changed it.
4. Recompute CRC16 for the chosen variant → bytes 46 to 47. Recompute CRC8 → byte 60.
5. Write **pages 4 to 15 only** (bytes 16 to 63), 4 bytes per `writePage`.
6. Read the card back and compare bytes 16 to 63 before claiming success. (VerdeNFC did not read-back verify; this app adds it, because "confirmation of exactly what was set" is the feature.)

A note on OTP: VerdeNFC's README says a source tag can be cloned "to any tag having still OTP != FFFFFFFF"; in practice, owners report fresh blank EV1 cards work, and a card whose OTP/lock configuration has been fully burned may refuse writes. If a write fails verification, try a fresh blank.

## File format (import/export and the community libraries)

The simple text dump both apps and the shared libraries use: 20 lines, one page per line, 8 hex characters per line. Annotated dumps in hackaverde add `[ AA:BB:CC:DD ] Addr. 04 : DATA` formatting; `TagData.imageFromDumpText` in this app reads both.

```text
046EEB09     <- page 0, UID
...
FFFFFFFF     <- page 3, OTP (this is VerdeNFC's filter-reset example card)
AA96644B     <- page 4, payload starts
...
18000000     <- page 15, CRC8 in the first byte
```

## Safety and honesty notes

- Roast profiles are thermal programs for a real heating appliance. Every profile shipped here is a published community profile that shipped on real cards or in VerdeNFC; this app adds no new thermal values of its own.
- The decoder's temperatures are a work-in-progress interpretation (see above). The bytes are exact; the labels are not gospel.
- Maintenance cards do what they say: the filter reset really resets the counter. If your filter is actually spent, resetting the counter does not un-spend it.
