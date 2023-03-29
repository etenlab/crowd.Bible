import { useEffect, useState } from 'react';
import { type SeedService } from '@/services/seed.service';
import { useSingletons } from './useSingletons';

export default function useSeedService() {
  const singletons = useSingletons();
  const [sync, setSync] = useState<SeedService>();

  useEffect(() => {
    setSync(singletons?.seedService);
  }, [singletons]);

  return sync;
}
