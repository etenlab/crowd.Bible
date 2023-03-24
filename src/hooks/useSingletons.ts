import { useState } from 'react';
import { getAppDataSource } from '../data-source';
import getSingletons, { ISingletons } from '../singletons';

export default function useSingletons() {
  const [singletons, setSingletons] = useState<ISingletons>();

  getAppDataSource().then((_ds) => {
    getSingletons(_ds).then(setSingletons);
  });

  return singletons;
}
