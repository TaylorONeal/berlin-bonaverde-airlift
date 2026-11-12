import {
  crc16Variant, crc8ForTag, hexToBytes, imageFromTemplate, merge, describe as describeCard,
  imageToDumpText, imageFromDumpText, minutesFromTick, tickFromMinutes, MAX_TICK,
  MENU, PROFILES, ARCHIVED_PROFILES, profileFor, writePages, withPauseMinutes, pauseMinutes,
} from '..';

// Real card dumps, pages 0 to 15, published by the hackaverde project.
const airfilter = hexToBytes(
  '04169903C2A75080B5480000FFFFFFFF' + 'AA41644B05AA4B413278AA565F5005AA' +
  '5D41469637375A2D230F0F000601DE41' + '00000000000000000000000024000000');
const brewOnly = hexToBytes(
  '04B11A27C2A75084B148000000000000' + 'AAAA644B00AAB8414664AAB2415A00AA' +
  'B04146553C465A2D23060F0005019A02' + '00000000000000000000000057000000');
const grindOnly = hexToBytes(
  '046C20C0C2A75084B148000000000000' + 'AAB24B4B00AAB2324678AAB54B5A00AA' +
  'B53246553C465A2D32041E000501DC02' + '0005000000000000000000000C000000');

describe('checksums match real cards', () => {
  it('CRC8', () => {
    expect(crc8ForTag(airfilter)).toBe(0x24);
    expect(crc8ForTag(brewOnly)).toBe(0x57);
    expect(crc8ForTag(grindOnly)).toBe(0x0c);
  });
  it('CRC16 variant', () => {
    expect(crc16Variant(airfilter)).toBe('single-use');
    expect(crc16Variant(brewOnly)).toBe('multi-use');
    expect(crc16Variant(grindOnly)).toBe('multi-use');
  });
  it('describes a real card as valid', () => {
    const pad = new Uint8Array(80); pad.set(brewOnly);
    const info = describeCard(pad);
    expect(info.command).toBe('brew');
    expect(info.valid).toBe(true);
  });
});

describe('merge', () => {
  const destination = new Uint8Array(80);
  destination.set(hexToBytes('04DEADBEC2A75080B548000000000000'));
  const template = imageFromTemplate(PROFILES.find((p) => p.key === 'brew90')!.templateHex);
  const merged = merge(template, destination, true);

  it('keeps the destination card identity', () => {
    expect(Array.from(merged.subarray(0, 16))).toEqual(Array.from(destination.subarray(0, 16)));
  });
  it('keeps the template payload', () => {
    expect(merged[20]).toBe(template[20]);
    expect(merged[41]).toBe(template[41]);
  });
  it('produces a card the machine accepts', () => {
    expect(crc16Variant(merged)).toBe('multi-use');
    expect(merged[60]).toBe(crc8ForTag(merged));
  });
  it('can make single-use cards too', () => {
    expect(crc16Variant(merge(template, destination, false))).toBe('single-use');
  });
  it('rebuilding a real card from its own payload reproduces it', () => {
    const real = new Uint8Array(80); real.set(grindOnly);
    expect(Array.from(merge(real, real, true).subarray(0, 64))).toEqual(Array.from(grindOnly));
  });
  it('writes exactly pages 4 to 15', () => {
    const pages = writePages(merged);
    expect(pages.map((p) => p.page)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    expect(pages.every((p) => p.data.length === 4)).toBe(true);
  });
  it('every template merges into a valid card', () => {
    for (const p of PROFILES) {
      const card = merge(imageFromTemplate(p.templateHex), destination, true);
      expect(describeCard(card).valid).toBe(true);
    }
  });
});

describe('pause', () => {
  it('round-trips within one step', () => {
    for (let m = 0; m <= 1440; m += 7) {
      expect(Math.abs(minutesFromTick(tickFromMinutes(m)) - m)).toBeLessThanOrEqual(14);
    }
    expect(minutesFromTick(tickFromMinutes(600))).toBe(600);
    expect(minutesFromTick(MAX_TICK)).toBe(1440);
  });
  it('lives at bytes 48 and 49', () => {
    const card = withPauseMinutes(new Uint8Array(80), 600);
    expect(card[48]).toBe(0x02);
    expect(card[49]).toBe(0x58);
    expect(pauseMinutes(card)).toBe(600);
  });
});

describe('menu', () => {
  it('every item maps to a template of the same mode', () => {
    for (const item of MENU) expect(profileFor(item).mode).toBe(item.mode);
  });
  it('every template is in the menu or the archive', () => {
    for (const p of PROFILES) {
      expect(MENU.some((m) => m.profileKey === p.key) || ARCHIVED_PROFILES.includes(p)).toBe(true);
    }
  });
  it('the overnight template already carries a 10 hour pause', () => {
    const night = MENU.find((m) => m.id === 'rgb-overnight')!;
    expect(pauseMinutes(imageFromTemplate(profileFor(night).templateHex))).toBe(600);
  });
});

describe('dump text', () => {
  it('round-trips', () => {
    const card = merge(imageFromTemplate(PROFILES[0].templateHex), airfilter, true);
    const text = imageToDumpText(card);
    expect(text.trim().split('\n')).toHaveLength(20);
    expect(Array.from(imageFromDumpText(text))).toEqual(Array.from(card));
  });
  it('reads annotated dumps', () => {
    const text = '[ AA:41:64:4B ] Addr. 04 : xx\n[ 05:AA:4B:41 ] Addr. 05 : xx\n';
    const card = imageFromDumpText(text);
    expect(card[16]).toBe(0xaa);
    expect(card[20]).toBe(0x05);
  });
});
