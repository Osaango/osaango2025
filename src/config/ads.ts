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
    id: 'beyond-the-api-economy-book',
    enabled: true,
    audience: 'categories',
    categories: ['blog', 'work'],
    title: 'New: Beyond the API Economy',
    description: 'What if the API, integration or AI solution is not the right place to start?',
    linkHref: '/books/',
    linkLabel: 'Explore the book',
  },
  {
    id: 'apiops-community-events',
    enabled: true,
    audience: 'all',
    title: 'Take APIOps Cycles into the real world 🌍',
    description: 'Meet practitioners working on API, integration, platform and AI challenges at upcoming APIOps events across Europe.',
    linkHref: 'https://www.apiops.info/#events',
    linkLabel: 'Find an APIOps event near you',
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
