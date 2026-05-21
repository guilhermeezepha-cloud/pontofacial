import {useFocusEffect} from '@react-navigation/native';

import React, {useCallback, useEffect, useState} from 'react';

import {on} from '../utils/eventBus';
import Session from '../utils/session';
import {PARTNER_LOGO_BASE64_KEY} from '../utils/storageKeys';

export function usePartnerLogo() {
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const uri = await Session.getRaw(PARTNER_LOGO_BASE64_KEY);
    setLogoUri(uri);
  };

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
    }, []),
  );

  useEffect(() => {
    const unsubscribe = on('partnerLogo:updated', newUri => {
      setLogoUri(newUri ?? null);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {logoUri, loading};
}
