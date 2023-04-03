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
        <Button variant="contained" sx={{ margin: '20px' }} fullWidth>
          Add Document
        </Button>
      </Link>
    </IonContent>
  );
}
