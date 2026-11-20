import type { ShareState } from '@atlas/shared';

export type RootStackParamList = {
  Gallery: undefined;
  Atlas: { atlasId: string; t?: string; event?: string; share?: ShareState };
  Search:
    | {
        atlasId?: string;
        regions?: string[];
        regionLabel?: string;
      }
    | undefined;
};
