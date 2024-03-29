import { useEffect, useState } from 'react';
import { getAppDataSource } from '@/src/data-source';
import getSingletons, { ISingletons } from '@/src/singletons';

/**
 * @deprecated
 * This hook will be depreciated in the future
 * Please use useAppContext hook instead of this.
 * If you developed some features using this please refactor them.
 *
 * example
 * const { states: { global: { singletons } } } = useAppContext();
 **/
export function useSingletons() {
  const [singletons, setSingletons] = useState<ISingletons>();

  useEffect(() => {
    getAppDataSource().then((_ds) => {
      getSingletons(_ds).then(setSingletons);
    });
  }, []);

  return singletons;
}
