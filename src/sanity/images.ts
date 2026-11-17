import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { publicConfig } from './environment';

export function responsiveImage(source: SanityImageSource, aspect: number, config = publicConfig()) {
  if (!config || !Number.isFinite(aspect) || aspect <= 0) throw new Error('Image configuration is incomplete.');
  const builder = createImageUrlBuilder(config).image(source).fit('crop').auto('format');
  const url = (width: number) => builder.width(width).height(Math.max(1, Math.round(width / aspect))).url();
  return { src: url(1200), width: 1200, height: Math.max(1, Math.round(1200 / aspect)),
    srcSet: [480, 768, 1200, 1800].map(width => `${url(width)} ${width}w`).join(', '),
    sizes: '(max-width: 900px) calc(100vw - 48px), 620px' };
}
