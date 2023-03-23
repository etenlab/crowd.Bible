import { useEffect, useState } from 'react';
import { DataSource } from 'typeorm';
import { getAppDataSource } from '../data-source';
import getSingletons, { ISingletons } from '../singletons';

export default function useSingletons() {
  const [ds, setDs] = useState<DataSource>();
  const [singletons, setSingletons] = useState<ISingletons>();

  getAppDataSource().then((_ds) => {
    if (_ds) {
      setDs(_ds);
    }
  });

  useEffect(() => {
    if (ds) {
      getSingletons(ds).then(setSingletons);
    }
  }, [ds]);

  return singletons;
}
