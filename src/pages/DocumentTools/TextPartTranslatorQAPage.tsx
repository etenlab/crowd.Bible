import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CrowdBibleUI, MuiMaterial, FiX } from '@eten-lab/ui-kit';
import { type Question } from '@eten-lab/ui-kit/dist/crowd-bible';

import { mockDocument } from './ReaderQAPage';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { FeedbackTypes } from '@/constants/common.constant';
import { RouteConst } from '@/constants/route.constant';

import { PageLayout } from '@/components/Layout';

const { LabelWithIcon, RangeSelectableTextArea, QuestionCreatorBox } =
  CrowdBibleUI;
const { Stack } = MuiMaterial;

export function TextPartTranslatorQAPage() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();
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
    history.push(RouteConst.TRANSLATOR_QA);
  };

  const handleCancel = () => {
    handleChangeRange({ start: null, end: null });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (question: Question) => {
    alertFeedback(FeedbackTypes.SUCCESS, 'Your question has been created!');
    history.push(RouteConst.TRANSLATOR_QA);
  };

  const questionCreatorBox =
    range.start !== null && range.end !== null ? (
      <QuestionCreatorBox onSave={handleSave} onCancel={handleCancel} />
    ) : null;

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
        {questionCreatorBox}
      </Stack>
    </PageLayout>
  );
}
