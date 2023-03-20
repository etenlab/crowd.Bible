import { dbService } from '..';
import { useEffect, useState } from 'react';
import { type DbService } from '@/services/db.service';

export default function useDbService() {
  const [service, setService] = useState<DbService>();

  useEffect(() => {
    const timerID = setTimeout(() => {
      setService(dbService);
    }, 1000);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

  return { service };
}
