import { useState } from 'react';
import { getAppDataSource } from 'src/data-source';
import getSingletons, { ISingletons } from '../singletons';

export default function useSingletons() {
  const [singletons, setSingletons] = useState<ISingletons>();

  getSingletons(getAppDataSource()).then(setSingletons);

  return singletons;
}
