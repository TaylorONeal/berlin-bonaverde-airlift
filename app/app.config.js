// Adds to app.json. The app never uses the network or shared storage, so Android
// builds leave those permissions out. Store builds (STORE_BUILD=1, set in
// codemagic.yaml) also drop INTERNET, which only development builds need to reach
// the local bundler. This is what lets PRIVACY.md say the app has no network access.
module.exports = ({ config }) => {
  const blocked = [
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.SYSTEM_ALERT_WINDOW',
  ];
  if (process.env.STORE_BUILD === '1') blocked.push('android.permission.INTERNET');
  return { ...config, android: { ...config.android, blockedPermissions: blocked } };
};
