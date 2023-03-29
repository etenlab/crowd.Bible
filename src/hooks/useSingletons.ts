import { useEffect, useState } from 'react';
import { getAppDataSource } from '../data-source';
import getSingletons, { ISingletons } from '../singletons';

export function useSingletons() {
  const [singletons, setSingletons] = useState<ISingletons>();

  useEffect(() => {
    getAppDataSource().then((_ds) => {
      getSingletons(_ds).then(setSingletons);
    });
  }, []);

  return singletons;
}
