import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Typography,
  CrowdBibleUI,
  MuiMaterial,
  BiCommentAdd,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { mockDocument } from './ReaderQAPage';
import { RouteConst } from '@/constants/route.constant';
import { PageLayout } from '@/components/Layout';

import { useTr } from '@/hooks/useTr';

const { LabelWithIcon, KindSelectionBox } = CrowdBibleUI;
const { Stack, Backdrop } = MuiMaterial;

export function TranslatorQAPage() {
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
    history.push(`${RouteConst.TRANSLATOR_QA}/text-part`);
  };

  const handleChapterClick = () => {
    handleCancelKindSelectionBox();
    history.push(`${RouteConst.TRANSLATOR_QA}/chapter`);
  };

  const handleVerseClick = () => {
    handleCancelKindSelectionBox();
    history.push(`${RouteConst.TRANSLATOR_QA}/verse`);
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
            title={tr('Ask Question')}
            label={tr('Сhoose what you want to leave asking for:')}
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
