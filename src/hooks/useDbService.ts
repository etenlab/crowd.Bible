import { useEffect, useState } from 'react';
import { DbService } from '../services/db.service';
import useSingletons from './useSingletons';

export default function useDbService() {
  const { dbService } = useSingletons();
  const [service, setService] = useState<DbService>();

  useEffect(() => {
    setService(service);
  }, [dbService]);

  return { service };
}
