import { useEffect, useState } from 'react';
import useSingletons from './useSingletons';
import { DefinitionService } from '@/services/definition.service';

export default function useDefinitionService() {
  const singletons = useSingletons();
  const [defSrv, setDefinitionService] = useState<DefinitionService>();

  useEffect(() => {
    setDefinitionService(singletons?.definitionService);
  }, [singletons]);

  return defSrv;
}
