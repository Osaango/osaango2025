export type DesignSystemAssetKind = "brand" | "favicon" | "glyph" | "human" | "icon";
export type DesignSystemAssetMetadata = {
    path: string;
    kind: DesignSystemAssetKind;
    tags: string[];
};
export type DesignSystemAssetManifest = {
    schemaVersion: number;
    assets: DesignSystemAssetMetadata[];
};
/** Default public mount point used by the package asset-copy CLI. */
export declare const designSystemAssetBasePath: "/design-system";
/** Build a public URL. Consumers deployed below an origin root can supply their own base path. */
export declare function designSystemAssetPath(path: string, basePath?: string): string;
/** Create the named asset inventory for a consumer-controlled public mount point. */
export declare function createDesignSystemAssets(basePath?: string): {
    readonly brand: {
        readonly cyclesLogo: string;
        readonly cyclesLogoDark: string;
        readonly cyclesLogoWhite: string;
    };
    readonly favicon: string;
    readonly icons: {
        readonly characterNotation: string;
        readonly method: string;
        readonly metro: string;
    };
    readonly humans: {
        readonly characterScenes: string;
        readonly scarfAmazed: string;
        readonly scarfCelebrating: string;
        readonly scarfHolding: string;
        readonly scarfHoldingUp: string;
        readonly scarfListening: string;
        readonly scarfPointing: string;
        readonly scarfStanding: string;
        readonly scarfThinking: string;
        readonly scarfWalking: string;
        readonly scarfWatchingHandDown: string;
        readonly scarfWatchingHandUp: string;
        readonly poses: string;
        readonly stories: string;
    };
};
/** Package-owned inventory for asset browsers, validation, and discovery. */
export declare const designSystemAssetManifest: DesignSystemAssetManifest;
export declare const designSystemAssets: {
    readonly brand: {
        readonly cyclesLogo: string;
        readonly cyclesLogoDark: string;
        readonly cyclesLogoWhite: string;
    };
    readonly favicon: string;
    readonly icons: {
        readonly characterNotation: string;
        readonly method: string;
        readonly metro: string;
    };
    readonly humans: {
        readonly characterScenes: string;
        readonly scarfAmazed: string;
        readonly scarfCelebrating: string;
        readonly scarfHolding: string;
        readonly scarfHoldingUp: string;
        readonly scarfListening: string;
        readonly scarfPointing: string;
        readonly scarfStanding: string;
        readonly scarfThinking: string;
        readonly scarfWalking: string;
        readonly scarfWatchingHandDown: string;
        readonly scarfWatchingHandUp: string;
        readonly poses: string;
        readonly stories: string;
    };
};
//# sourceMappingURL=index.d.ts.map