import { useEffect, useState } from 'react';
import { type SyncService } from '../services/sync.service';
import useSingletons from './useSingletons';

export default function useSyncService() {
  const { syncService } = useSingletons();
  const [sync, setSync] = useState<SyncService>();

  useEffect(() => {
    setSync(syncService);
  }, [syncService]);

  return sync;
}
