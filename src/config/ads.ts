export type BannerAudience = 'all' | 'categories';

export interface PromotionBanner {
  id: string;
  enabled: boolean;
  audience: BannerAudience;
  categories?: string[];
  title: string;
  description?: string;
  linkHref: string;
  linkLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  excludePaths?: string[];
}

/**
 * Configure promotional banners here.
 * - `audience: 'all'` shows the banner on every page (unless excluded).
 * - `audience: 'categories'` only shows the banner on matching top-level route segments.
 *   Example category values: `blog`, `services`, `work`, `about`.
 */
export const ads: PromotionBanner[] = [
  {
    id: 'apiops-cycles-promo',
    enabled: true,
    audience: 'categories',
    categories: ['services'],
    title: 'Current event: APIOps Cycles discovery workshop now booking for spring.',
    description: 'Reserve your slot for a practical session focused on faster API delivery outcomes.',
    linkHref: '/services/accelerate-your-apis-with-apiops-cycles',
    linkLabel: 'Learn more',
  },
  {
    id: 'agile-games-highlight',
    enabled: false,
    audience: 'all',
    title: 'Promotion: Team up with our Agile collaboration games workshop.',
    description: 'A hands-on format for improving cross-functional delivery and communication.',
    linkHref: '/services/agile-collaboration-games',
    linkLabel: 'Book a workshop',
    imageSrc: '/images/promotions/agile-games-banner.jpg',
    imageAlt: 'Facilitated workshop participants in a collaborative game setup.',
  },
];

const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

const topLevelSegment = (pathname: string) => {
  const normalizedPath = normalizePath(pathname);
  const segments = normalizedPath.split('/').filter(Boolean);
  return segments[0] ?? '';
};

const isExcludedPath = (ad: PromotionBanner, pathname: string) => {
  if (!ad.excludePaths?.length) return false;
  const normalizedPath = normalizePath(pathname);
  return ad.excludePaths.some((path) => normalizePath(path) === normalizedPath);
};

export const getActiveBanner = (pathname: string): PromotionBanner | undefined => {
  const category = topLevelSegment(pathname);

  return ads.find((ad) => {
    if (!ad.enabled || isExcludedPath(ad, pathname)) {
      return false;
    }

    if (ad.audience === 'all') {
      return true;
    }

    if (!ad.categories?.length) {
      return false;
    }

    return ad.categories.includes(category);
  });
};
