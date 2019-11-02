export const breakpoints = {
  phone: 320,
  phoneWide: 480,
  tablet: 640,
  tabletWide: 880,
  laptop: 1024,
  desktop: 1440,
}

type MediaType = 'max' | 'min';

/**
 * > | Generates a css string alike: (at)media (max/min-width: value px)
 * @param {string} mediaType
 * @param {number} breakpoint
 */
export const mq = (mediaType: MediaType, breakpoint: number): string =>
  `@media (${mediaType === 'max' ? `max` : `min`}-width: ${breakpoint}px)`
