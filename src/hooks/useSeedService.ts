import { seedService } from '..';
import { useEffect, useState } from 'react';
import useDbService from './useDbService';
import { type SeedService } from '@/services/seed.service';

export default function useSeedService() {
  const { service } = useDbService();
  const [sync, setSync] = useState<SeedService>();

  useEffect(() => {
    if (service?.dataSource != null) {
      setSync(seedService);
    }
  }, [service]);

  return sync;
}
