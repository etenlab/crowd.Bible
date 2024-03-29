import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CrowdBibleUI, MuiMaterial, FiX } from '@eten-lab/ui-kit';

import { mockDocument } from './ReaderQAPage';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

import { FeedbackInput } from '@/components/FeedbackInput';
import { PageLayout } from '@/components/Layout';

const { LabelWithIcon, RangeSelectableTextArea } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function TextPartFeedbackPage() {
  const history = useHistory();
  const { tr } = useTr();

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
    history.push(RouteConst.FEEDBACK);
  };

  const feedbackInput =
    range.start !== null && range.end !== null ? <FeedbackInput /> : null;

  return (
    <PageLayout>
      <Stack
        justifyContent="space-between"
        sx={{ height: 'calc(100vh - 68px)' }}
      >
        <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
          <LabelWithIcon
            label={tr('translation')}
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
    </PageLayout>
  );
}
