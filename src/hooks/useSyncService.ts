import { syncService } from '..';
import { useEffect, useState } from 'react';
import useDbService from './useDbService';
import { SyncService } from '../services/sync.service';

export default function useSyncService() {
  const { service } = useDbService();
  const [sync, setSync] = useState<SyncService>();

  useEffect(() => {
    if (service?.dataSource) {
      setSync(syncService);
    }
  }, [service]);

  return sync;
}
