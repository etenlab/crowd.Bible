import { useEffect, useState } from 'react';
import { type SyncService } from '@eten-lab/core';
import { useSingletons } from './useSingletons';

export default function useSyncService() {
  const singletons = useSingletons();
  const [sync, setSync] = useState<SyncService>();

  useEffect(() => {
    setSync(singletons?.syncService);
  }, [singletons]);

  return sync;
}
