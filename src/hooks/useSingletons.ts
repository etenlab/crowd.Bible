import { useEffect, useState } from 'react';
import { getAppDataSource } from '../data-source';
import getSingletons, { ISingletons } from '../singletons';

/**
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
