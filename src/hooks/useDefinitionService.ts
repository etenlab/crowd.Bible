import { useEffect, useState } from 'react';
import { DefinitionService } from '@/services/definition.service';
import { useSingletons } from './useSingletons';

export function useDefinitionService() {
  const singletons = useSingletons();
  const [defSrv, setDefinitionService] = useState<DefinitionService>();

  useEffect(() => {
    setDefinitionService(singletons?.definitionService);
  }, [singletons]);

  return defSrv;
}
