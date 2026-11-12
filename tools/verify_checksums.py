#!/usr/bin/env python3
"""
Verify the checksums used by Berlin Airlift against real card dumps.

The dumps below are transcribed from PostalBlab/hackaverde, NFC/tags
(airfilter, brew_only, grind_only):
  https://github.com/PostalBlab/hackaverde

The algorithms are a straight port of VerdeChecksums.cs from VerdeNFC
by btrappe: https://github.com/btrappe/VerdeNFC

Expected result (verified 2026-10-22):
  airfilter   CRC8 MATCH, CRC16 single-use MATCH
  brew_only   CRC8 MATCH, CRC16 multi-use  MATCH
  grind_only  CRC8 MATCH, CRC16 multi-use  MATCH
"""

SINGLE_LOOKUP = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x10, 0x12, 0x13,
                 0x16, 0x17, 0x19, 0x1B, 0x1C, 0x1F, 0x20, 0x22, 0x25, 0x27,
                 0x28, 0x29, 0x2A, 0x2D]
MULTI_LOOKUP = [0x00, 0x02, 0x03, 0x04, 0x06, 0x10, 0x11, 0x12, 0x14, 0x17,
                0x18, 0x19, 0x1B, 0x1E, 0x1F, 0x20, 0x21, 0x23, 0x24, 0x26,
                0x28, 0x2A, 0x2B, 0x2C, 0x2D]


def crc16(param, multi):
    if multi:
        checksum = (param[0] * param[2] * 5) & 0xFFFF
        lookup, xorv = MULTI_LOOKUP, 0xD2
    else:
        checksum = (param[1] * param[2] * 5) & 0xFFFF
        lookup, xorv = SINGLE_LOOKUP, 0xA1
    for b in lookup[2:]:
        checksum ^= param[b]
    return (checksum ^ xorv) & 0xFFFF


_TABLE = []
for _i in range(256):
    _t = _i
    for _ in range(8):
        _t = ((_t << 1) ^ 0x07) if (_t & 0x80) else (_t << 1)
    _TABLE.append(_t & 0xFF)


def crc8(data):
    crc = 0
    for b in data:
        crc = _TABLE[crc ^ b]
    return crc


def parse_dump(txt):
    import re
    mem = bytearray(80)
    for line in txt.strip().splitlines():
        m = re.match(r"\[\s*([0-9A-Fa-f:]+)\s*\]\s*Addr\.\s*([0-9A-Fa-f]+)", line.strip())
        if m:
            addr = int(m.group(2), 16)
            mem[addr * 4: addr * 4 + 4] = bytes(int(x, 16) for x in m.group(1).split(":"))
    return bytes(mem)


DUMPS = {
    "airfilter": """
[ 04:16:99:03 ] Addr. 00 : UID
[ C2:A7:50:80 ] Addr. 01 : UID
[ B5:48:00:00 ] Addr. 02 : LOCK
[ FF:FF:FF:FF ] Addr. 03 : OTP
[ AA:41:64:4B ] Addr. 04 : DATA
[ 05:AA:4B:41 ] Addr. 05 : DATA
[ 32:78:AA:56 ] Addr. 06 : DATA
[ 5F:50:05:AA ] Addr. 07 : DATA
[ 5D:41:46:96 ] Addr. 08 : DATA
[ 37:37:5A:2D ] Addr. 09 : DATA
[ 23:0F:0F:00 ] Addr. 0A : DATA
[ 06:01:DE:41 ] Addr. 0B : DATA
[ 00:00:00:00 ] Addr. 0C : DATA
[ 00:00:00:00 ] Addr. 0D : DATA
[ 00:00:00:00 ] Addr. 0E : DATA
[ 24:00:00:00 ] Addr. 0F : DATA
""",
    "brew_only": """
[ 04:B1:1A:27 ] Addr. 00 : UID
[ C2:A7:50:84 ] Addr. 01 : UID
[ B1:48:00:00 ] Addr. 02 : LOCK
[ 00:00:00:00 ] Addr. 03 : OTP
[ AA:AA:64:4B ] Addr. 04 : DATA
[ 00:AA:B8:41 ] Addr. 05 : DATA
[ 46:64:AA:B2 ] Addr. 06 : DATA
[ 41:5A:00:AA ] Addr. 07 : DATA
[ B0:41:46:55 ] Addr. 08 : DATA
[ 3C:46:5A:2D ] Addr. 09 : DATA
[ 23:06:0F:00 ] Addr. 0A : DATA
[ 05:01:9A:02 ] Addr. 0B : DATA
[ 00:00:00:00 ] Addr. 0C : DATA
[ 00:00:00:00 ] Addr. 0D : DATA
[ 00:00:00:00 ] Addr. 0E : DATA
[ 57:00:00:00 ] Addr. 0F : DATA
""",
    "grind_only": """
[ 04:6C:20:C0 ] Addr. 00 : UID
[ C2:A7:50:84 ] Addr. 01 : UID
[ B1:48:00:00 ] Addr. 02 : LOCK
[ 00:00:00:00 ] Addr. 03 : OTP
[ AA:B2:4B:4B ] Addr. 04 : DATA
[ 00:AA:B2:32 ] Addr. 05 : DATA
[ 46:78:AA:B5 ] Addr. 06 : DATA
[ 4B:5A:00:AA ] Addr. 07 : DATA
[ B5:32:46:55 ] Addr. 08 : DATA
[ 3C:46:5A:2D ] Addr. 09 : DATA
[ 32:04:1E:00 ] Addr. 0A : DATA
[ 05:01:DC:02 ] Addr. 0B : DATA
[ 00:05:00:00 ] Addr. 0C : DATA
[ 00:00:00:00 ] Addr. 0D : DATA
[ 00:00:00:00 ] Addr. 0E : DATA
[ 0C:00:00:00 ] Addr. 0F : DATA
""",
}


def main():
    ok = True
    for name, txt in DUMPS.items():
        mem = parse_dump(txt)
        stored16 = mem[46] | (mem[47] << 8)
        single, multi = crc16(mem, False), crc16(mem, True)
        c8 = crc8(mem[0:12] + mem[16:60])
        variant = "single-use" if single == stored16 else "multi-use" if multi == stored16 else "NONE"
        c8_ok = c8 == mem[60]
        crc_ok = variant != "NONE"
        ok = ok and c8_ok and crc_ok
        print(f"{name:11s} type=0x{mem[41]:02X}  CRC16 {variant} MATCH  "
              f"CRC8 {'MATCH' if c8_ok else 'FAIL'}")
    print("\nALL CHECKSUMS VERIFIED" if ok else "\nMISMATCH - do not ship")
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
