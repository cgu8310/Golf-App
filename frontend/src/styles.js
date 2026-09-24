import { Platform } from 'react-native';

const s = (web, native) => Platform.select({ web, default: native });

export const cardShadow = s(
  { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }
);

export const blueCardShadow = s(
  { boxShadow: '0 4px 8px rgba(14,165,233,0.3)' },
  { shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }
);

export const blueButtonShadow = s(
  { boxShadow: '0 3px 6px rgba(14,165,233,0.3)' },
  { shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 }
);
