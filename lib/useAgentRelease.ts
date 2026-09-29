'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AgentRelease, FINGER_AGENT_LATEST_PATH } from '@/lib/fingerprint';

// Backend-д байршуулсан хамгийн сүүлийн уншигчийн програм. Алдаа гарвал null — юу ч хаахгүй.
export function useAgentRelease() {
  const [release, setRelease] = useState<AgentRelease | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api(FINGER_AGENT_LATEST_PATH)
      .then((res) => {
        if (!cancelled) setRelease(res?.release ?? null);
      })
      .catch((err) => console.log('finger agent latest error:', err));
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  return { release, refresh };
}
