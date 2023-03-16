import { useEffect, useState } from 'react';
import { NodeService } from '../services/node.service';
import useDbService from './useDbService';
import useSyncService from './useSyncService';

export default function useNodeServices() {
  const { service } = useDbService();
  const syncService = useSyncService();
  const [nodeService, setNodeService] = useState<NodeService>();

  useEffect(() => {
    if (service?.dataSource != null && syncService != null) {
      setNodeService(new NodeService(service, syncService));
    }
  }, [service, syncService]);

  return { nodeService };
}
