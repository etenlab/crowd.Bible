import { syncService } from '../singletons';
import { useEffect, useState } from 'react';
import useDbService from './useDbService';
import { type SyncService } from '../services/sync.service';

export default function useSyncService() {
  const { service } = useDbService();
  const [sync, setSync] = useState<SyncService>();

  useEffect(() => {
    if (service?.dataSource != null) {
      setSync(syncService);
    }
  }, [service]);

  return sync;
}
