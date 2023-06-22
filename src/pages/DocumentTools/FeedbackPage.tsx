import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Typography,
  CrowdBibleUI,
  MuiMaterial,
  BiCommentAdd,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { useTr } from '@/hooks/useTr';

import { mockDocument } from './ReaderQAPage';
import { RouteConst } from '@/constants/route.constant';

import { PageLayout } from '@/components/Layout';

const { LabelWithIcon, KindSelectionBox } = CrowdBibleUI;
const { Stack, Backdrop } = MuiMaterial;

export function FeedbackPage() {
  const { getColor } = useColorModeContext();
  const history = useHistory();
  const { tr } = useTr();

  const [openedKindSelectionBox, setOpenedKindSelectionBox] =
    useState<boolean>(false);

  const handleClickPlus = () => {
    setOpenedKindSelectionBox(true);
  };

  const handleCancelKindSelectionBox = () => {
    setOpenedKindSelectionBox(false);
  };

  const handleTextClick = () => {
    handleCancelKindSelectionBox();
    history.push(RouteConst.FEEDBACK_TEXT_PART);
  };

  const handleChapterClick = () => {
    handleCancelKindSelectionBox();
    history.push(RouteConst.FEEDBACK_CHAPTER);
  };

  const handleVerseClick = () => {
    handleCancelKindSelectionBox();
    history.push(RouteConst.FEEDBACK_VERSE);
  };

  return (
    <PageLayout>
      <Stack sx={{ padding: '20px' }}>
        <LabelWithIcon
          label={tr('translation')}
          icon={<BiCommentAdd />}
          color="gray"
          onClick={handleClickPlus}
        />
        <Typography
          variant="body2"
          color="text.dark"
          sx={{
            lineHeight: '30px',
            textAlign: 'justify',
          }}
        >
          {mockDocument}
        </Typography>
      </Stack>
      <Backdrop
        open={openedKindSelectionBox}
        sx={{
          alignItems: 'flex-start',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack
          sx={{
            borderRadius: '0 0 20px 20px',
            width: '100%',
            background: getColor('white'),
          }}
        >
          <KindSelectionBox
            title={tr('Leave Feedback')}
            label={tr('Choose what you want to leave feedback for:')}
            onTextClick={handleTextClick}
            onChapterClick={handleChapterClick}
            onVerseClick={handleVerseClick}
            onCancel={handleCancelKindSelectionBox}
          />
        </Stack>
      </Backdrop>
    </PageLayout>
  );
}
