import useSingletons from './useSingletons';

export default function useNodeServices() {
  const singletons = useSingletons();
  return singletons?.nodeService;
}
