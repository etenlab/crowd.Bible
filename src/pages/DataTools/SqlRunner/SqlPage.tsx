import { PageLayout } from '@/components/Layout';
import { SqlRunner } from './SqlRunner';

export function SqlPage() {
  return (
    <PageLayout>
      <SqlRunner></SqlRunner>
    </PageLayout>
  );
}
