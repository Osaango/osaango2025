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
    id: 'apiops-cycles-apidays-india-2026',
    enabled: true,
    audience: 'all',
    title: 'APIdays India 2026 workshop: Creating Valuable Digital Capabilities with APIs - APIOps Cycles in Practice',
    description: 'Join Marjukka Niinioja for a full-day hands-on workshop on 21 Aug 2026.',
    linkHref: '/events/creating-valuable-digital-capabilities-with-apis/',
    linkLabel: 'View event',
    excludePaths: ['/events/creating-valuable-digital-capabilities-with-apis/', '/services/accelerate-your-apis-with-apiops-cycles'],
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
