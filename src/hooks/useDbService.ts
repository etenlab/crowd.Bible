import { useEffect, useState } from 'react';
import { DbService } from '@eten-lab/core/src/services';
import { useSingletons } from './useSingletons';

export default function useDbService() {
  const singletons = useSingletons();
  const [service, setService] = useState<DbService>();

  useEffect(() => {
    setService(singletons?.dbService);
  }, [singletons]);

  return { service };
}
