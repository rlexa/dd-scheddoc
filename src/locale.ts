import {registerLocaleData} from '@angular/common';

export interface AngularLocaleData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: Promise<any>;
}

export type FnAngularLocaleData = (locale: string) => null | AngularLocaleData;

export enum UnityNgLocale {
  de = 'de',
  deDE = 'de-DE',
  en = 'en',
  enGB = 'en-GB',
  enUS = 'en-US',
}

const ngLoadLocaleSpecific: FnAngularLocaleData = (locale) => {
  switch (locale) {
    case UnityNgLocale.de:
    case UnityNgLocale.deDE:
      return {data: import('@angular/common/locales/de'), extra: import('@angular/common/locales/extra/de')};
    case UnityNgLocale.enUS:
      return {data: import('@angular/common/locales/en'), extra: import('@angular/common/locales/extra/en')};
    case UnityNgLocale.en: // !!! do not remove 'en' handler (used as fallback)
    case UnityNgLocale.enGB:
      return {data: import('@angular/common/locales/en-GB'), extra: import('@angular/common/locales/extra/en-GB')};
  }

  return null;
};

const ngLoaderLocaleShortened = (): FnAngularLocaleData => (locale) => {
  const loc = locale.substring(0, 2);
  if (loc === locale) {
    return null;
  }
  return ngLoadLocaleSpecific(loc);
};

const ngLoaderLocaleFallback = (): FnAngularLocaleData => () => {
  return ngLoadLocaleSpecific(UnityNgLocale.en);
};

function loadLocale(locale: string, customAngularLocaleLoaders?: FnAngularLocaleData | FnAngularLocaleData[]) {
  let data: AngularLocaleData | null = null;
  const loaders: FnAngularLocaleData[] = [
    ...(typeof customAngularLocaleLoaders === 'function'
      ? [customAngularLocaleLoaders]
      : Array.isArray(customAngularLocaleLoaders)
        ? customAngularLocaleLoaders
        : []),
    ngLoadLocaleSpecific,
    ngLoaderLocaleShortened(),
    ngLoaderLocaleFallback(),
  ];
  for (const loader of loaders) {
    data = loader(locale);
    if (data) {
      break;
    }
  }

  if (!data) {
    return Promise.resolve();
  }

  return Promise.all([data.data, data.extra ?? Promise.resolve(null)]).then(([data, extra]) => {
    registerLocaleData(data.default, locale, extra?.default);
  });
}

export function initializeLocaleFactory(locales: string[], customAngularLocaleLoaders?: FnAngularLocaleData | FnAngularLocaleData[]) {
  return () => {
    locales = Array.from(new Set(locales.filter((ii) => ii?.length)));
    if (!locales.length) {
      return Promise.resolve();
    }

    return Promise.all(locales.map((locale) => loadLocale(locale, customAngularLocaleLoaders)));
  };
}
