import {useFocusEffect} from '@react-navigation/native';

import React, {useCallback, useEffect, useState} from 'react';

import {CollectorWithoutLogo} from '../features/register/Types';

import {on} from '../utils/eventBus';
import Session from '../utils/session';
import {IDENTIFICATION_DATA_KEY} from '../utils/storageKeys';

export function useIdentificationData() {
  const [identificationData, setIdentificationData] =
    useState<CollectorWithoutLogo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await Session.get<CollectorWithoutLogo>(
      IDENTIFICATION_DATA_KEY,
    );
    setIdentificationData(data ?? null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        await load();
        if (!cancelled) setLoading(false);
      })();
      return () => {
        cancelled = true;
      };
    }, [load]),
  );

  useEffect(() => {
    const unsubscribe = on('identificationData:updated', next => {
      setIdentificationData(next ?? null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {identificationData, loading, reload: load};
}
