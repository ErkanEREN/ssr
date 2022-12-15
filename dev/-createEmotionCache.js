import createCache from '@emotion/cache';

export default function createEmotionCache(prepend = false, speedy = true) {
  return createCache({ key: 'reaxprosstcss', prepend, speedy });
}