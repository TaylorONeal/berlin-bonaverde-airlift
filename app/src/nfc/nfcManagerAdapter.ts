import { Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { CardAdapter, CardError, CardSession } from './types';

const READ = 0x30;
const WRITE = 0xa2;

function toCardError(e: unknown): CardError {
  if (e instanceof CardError) return e;
  const msg = String((e as { message?: string })?.message ?? e).toLowerCase();
  if (msg.includes('cancel')) return new CardError('cancelled');
  if (msg.includes('lost') || msg.includes('tag was lost') || msg.includes('connection')) return new CardError('card-moved');
  if (msg.includes('not supported') || msg.includes('tech')) return new CardError('wrong-card');
  return new CardError('unknown', msg);
}

let started = false;
async function ensureStarted() {
  if (!started) {
    await NfcManager.start();
    started = true;
  }
}

/** Real cards, through Core NFC on iOS and MifareUltralight on Android. */
export const nfcManagerAdapter: CardAdapter = {
  async availability() {
    try {
      if (!(await NfcManager.isSupported())) return 'no-nfc';
      await ensureStarted();
      if (Platform.OS === 'android' && !(await NfcManager.isEnabled())) return 'nfc-off';
      return 'ready';
    } catch {
      return 'no-nfc';
    }
  },

  async cancel() {
    await NfcManager.cancelTechnologyRequest().catch(() => {});
  },

  async withCard(prompt, work) {
    await ensureStarted();
    const ios = Platform.OS === 'ios';
    try {
      await NfcManager.requestTechnology(ios ? NfcTech.MifareIOS : NfcTech.MifareUltralight, { alertMessage: prompt });
      const session: CardSession = ios
        ? {
            read4: (page) => NfcManager.sendMifareCommandIOS([READ, page]),
            writePage: async (page, data) => {
              await NfcManager.sendMifareCommandIOS([WRITE, page, ...data.slice(0, 4)]);
            },
            setMessage: (text) => NfcManager.setAlertMessageIOS(text),
          }
        : {
            read4: (page) => NfcManager.mifareUltralightHandlerAndroid.mifareUltralightReadPages(page),
            writePage: (page, data) => NfcManager.mifareUltralightHandlerAndroid.mifareUltralightWritePage(page, data.slice(0, 4)),
            setMessage: async () => {},
          };
      const result = await work(session);
      return result;
    } catch (e) {
      const err = toCardError(e);
      if (ios) await NfcManager.invalidateSessionWithErrorIOS(err.message).catch(() => {});
      throw err;
    } finally {
      await NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  },
};
