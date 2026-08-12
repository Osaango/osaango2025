import manifest from "../metadata/assets.json" with { type: "json" };
/** Default public mount point used by the package asset-copy CLI. */
export const designSystemAssetBasePath = "/design-system";
/** Build a public URL. Consumers deployed below an origin root can supply their own base path. */
export function designSystemAssetPath(path, basePath = designSystemAssetBasePath) {
    return `${basePath.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
/** Create the named asset inventory for a consumer-controlled public mount point. */
export function createDesignSystemAssets(basePath = designSystemAssetBasePath) {
    const assetPath = (path) => designSystemAssetPath(path, basePath);
    return {
        brand: {
            cyclesLogo: assetPath("brand/apiops-cycles-logo.svg"),
            cyclesLogoDark: assetPath("brand/apiops-cycles-logo-dark.svg"),
            cyclesLogoWhite: assetPath("brand/apiops-cycles-logo-white.svg"),
        },
        favicon: assetPath("favicons/favicon.svg"),
        icons: {
            characterNotation: assetPath("icons/apiops-character-notation.svg"),
            method: assetPath("icons/apiops-iconset.svg"),
            metro: assetPath("icons/apiops-metro-icons.svg"),
        },
        humans: {
            characterScenes: assetPath("humans/apiops-character-scenes.svg"),
            scarfAmazed: assetPath("humans/pose-with-scarf-amazed.svg"),
            scarfCelebrating: assetPath("humans/pose-with-scarf-dancing.svg"),
            scarfHolding: assetPath("humans/pose-with-scarf-holding.svg"),
            scarfHoldingUp: assetPath("humans/pose-with-scarf-holding-up.svg"),
            scarfListening: assetPath("humans/pose-with-scarf-listening.svg"),
            scarfPointing: assetPath("humans/pose-with-scarf-pointing.svg"),
            scarfStanding: assetPath("humans/pose-with-scarf-standing.svg"),
            scarfThinking: assetPath("humans/pose-with-scarf-thinking.svg"),
            scarfWalking: assetPath("humans/pose-with-scarf-walking.svg"),
            scarfWatchingHandDown: assetPath("humans/pose-with-scarf-watching-hand-down.svg"),
            scarfWatchingHandUp: assetPath("humans/pose-with-scarf-watching-hand-up.svg"),
            poses: assetPath("humans/apiops-stick-figures-poses.svg"),
            stories: assetPath("humans/apiops-stick-figures-stories.svg"),
        },
    };
}
/** Package-owned inventory for asset browsers, validation, and discovery. */
export const designSystemAssetManifest = manifest;
export const designSystemAssets = createDesignSystemAssets();
