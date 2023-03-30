import { useEffect, useState } from 'react';
import { DbService } from '@/services/db.service';
import { useSingletons } from './useSingletons';

export default function useDbService() {
  const singletons = useSingletons();
  const [service, setService] = useState<DbService>();

  useEffect(() => {
    setService(singletons?.dbService);
  }, [singletons]);

  return { service };
}
