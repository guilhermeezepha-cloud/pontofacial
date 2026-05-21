import {useEffect, useMemo, useState} from 'react';
import {Image, ImageSourcePropType} from 'react-native';

export type AspectInput = string | ImageSourcePropType | null | undefined;

interface UseImageAspectRatioOptions {
  initialRatio?: number;
}

interface UseImageAspectRatioResult {
  ratio: number;
  source: ImageSourcePropType | undefined;
}

export function useImageAspectRatio(
  input: AspectInput,
  {initialRatio = 1}: UseImageAspectRatioOptions = {},
): UseImageAspectRatioResult {
  const [ratio, setRatio] = useState(initialRatio);

  const source = useMemo<ImageSourcePropType | undefined>(() => {
    if (!input) return undefined;
    return typeof input === 'string' ? {uri: input} : input;
  }, [input]);

  useEffect(() => {
    if (!source) {
      setRatio(initialRatio);
      return;
    }

    if (typeof source === 'object' && 'uri' in source && source.uri) {
      Image.getSize(
        source.uri,
        (w, h) => setRatio(w / h),
        () => setRatio(initialRatio),
      );
      return;
    }

    const resolved = Image.resolveAssetSource(source as any);
    if (resolved?.width && resolved?.height) {
      setRatio(resolved.width / resolved.height);
    } else {
      setRatio(initialRatio);
    }
  }, [source, initialRatio]);

  return {ratio, source};
}
