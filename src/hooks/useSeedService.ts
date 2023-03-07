import { seedService } from '..';
import { useEffect, useState } from 'react';
import useDbService from './useDbService';
import { SeedService } from '../services/seed.service';

export default function useSeedService() {
  const { service } = useDbService();
  const [sync, setSync] = useState<SeedService>();

  useEffect(() => {
    if (service?.dataSource) {
      setSync(seedService);
    }
  }, [service]);

  return sync;
}
