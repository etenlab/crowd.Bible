import { IonContent } from '@ionic/react';

import { Button } from '@eten-lab/ui-kit';

import { LangugeSelectionBox } from '@/components/LanguageSelectionBox';
import { DocumentList } from '@/components/DocumentList';
import { Link } from '@/components/Link';

export function DocumentsListPage() {
  return (
    <IonContent>
      <LangugeSelectionBox />
      <DocumentList />
      <Link to="/add-document">
        <div style={{ width: '100%', padding: '20px' }}>
          <Button variant="contained" fullWidth>
            Add Document
          </Button>
        </div>
      </Link>
    </IonContent>
  );
}
