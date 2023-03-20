import { useEffect, useState } from 'react';
import { AppDataSource } from '../data-source';
import { DbService } from '../services/db.service';

export default function useDbService() {
  const [service, setService] = useState<DbService>();

  useEffect(() => {
    const timerID = setTimeout(() => {
      setService(new DbService(AppDataSource));
    }, 1000);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

  return { service };
}
