import useSingletons from './useSingletons';

export default function useNodeServices() {
  const { nodeService } = useSingletons();
  return { nodeService };
}
