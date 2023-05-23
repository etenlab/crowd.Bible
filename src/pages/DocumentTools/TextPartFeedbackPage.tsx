import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, MuiMaterial, FiX } from '@eten-lab/ui-kit';

import { mockDocument } from './ReaderQAPage';
import { FeedbackInput } from '@/components/FeedbackInput';

const { LabelWithIcon, RangeSelectableTextArea } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function TextPartFeedbackPage() {
  const history = useHistory();
  const [range, setRange] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });

  const handleChangeRange = ({
    start,
    end,
  }: {
    start: number | null;
    end: number | null;
  }) => {
    setRange({ start, end });
  };

  const handleClickCancel = () => {
    history.push('/feedback');
  };

  const feedbackInput =
    range.start !== null && range.end !== null ? <FeedbackInput /> : null;

  return (
    <IonContent>
      <Stack
        justifyContent="space-between"
        sx={{ height: 'calc(100vh - 68px)' }}
      >
        <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
          <LabelWithIcon
            label="translation"
            icon={<FiX />}
            color="gray"
            onClick={handleClickCancel}
          />
          <RangeSelectableTextArea
            text={mockDocument}
            range={range}
            onChangeRange={handleChangeRange}
          />
        </Stack>
        {feedbackInput}
      </Stack>
    </IonContent>
  );
}
