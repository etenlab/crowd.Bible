import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { IonContent } from '@ionic/react';

import { CrowdBibleUI, Typography } from '@eten-lab/ui-kit';

import { DocumentDto } from '@/dtos/document.dto';
import { WordSequenceDto } from '@/src/dtos/word-sequence.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';
import { useWordSequence } from '@/hooks/useWordSequence';

const { HeadBox } = CrowdBibleUI;

export function DocumentViewerPage() {
  const history = useHistory();
  const { documentId } = useParams<{
    documentId: Nanoid;
  }>();

  const {
    states: {
      global: { singletons },
    },
  } = useAppContext();

  const { getDocumentById } = useDocument();
  const { getWordSequenceByDocumentId } = useWordSequence();

  const [document, setDocument] = useState<DocumentDto | null>(null);
  const [wordSequence, setWordSequence] = useState<WordSequenceDto | null>(
    null,
  );

  // Fetch Document Lists from db
  useEffect(() => {
    if (singletons) {
      getDocumentById(documentId).then(setDocument);
      getWordSequenceByDocumentId(documentId).then(setWordSequence);
    }
  }, [getDocumentById, getWordSequenceByDocumentId, singletons, documentId]);

  const handleClickBackBtn = () => {
    history.goBack();
  };

  return (
    <IonContent>
      <HeadBox title={document?.name} back={{ action: handleClickBackBtn }} />
      <Typography
        variant="overline"
        color="text.dark"
        sx={{
          paddingBottom: '16px',
          opacity: 0.5,
        }}
      >
        Original
      </Typography>
      <Typography
        variant="body1"
        color="text.dark"
        sx={{ lineHeight: '30px', textAlign: 'justify' }}
      >
        {wordSequence?.text}
      </Typography>
    </IonContent>
  );
}
