import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { type Question } from '@eten-lab/ui-kit/dist/crowd-bible';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { mockVerses, ChapterList } from './VerseFeedbackPage';
import { FeedbackTypes } from '@/constants/common.constant';
import { RouteConst } from '@/constants/route.constant';

import { PageLayout } from '@/components/Layout';

const { TitleWithIcon, VerticalRadioList, QuestionCreatorBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

interface VerseFeedbackProps {
  onClickCancel: () => void;
  onClickBack: () => void;
}

function VerseTranslatorQA({ onClickCancel, onClickBack }: VerseFeedbackProps) {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();
  const { tr } = useTr();

  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);

  const handleChangeVerse = (
    _event: React.SyntheticEvent<Element, Event>,
    verse: string,
  ) => {
    setSelectedVerse(verse);
  };

  const handleCancel = () => {
    setSelectedVerse(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (question: Question) => {
    alertFeedback(FeedbackTypes.SUCCESS, 'Your question has been created!');
    history.push(RouteConst.TRANSLATOR_QA);
  };

  const questionCreatorBox =
    selectedVerse !== null ? (
      <QuestionCreatorBox onSave={handleSave} onCancel={handleCancel} />
    ) : null;

  return (
    <Stack justifyContent="space-between" sx={{ height: 'calc(100vh - 68px)' }}>
      <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
        <TitleWithIcon
          label={tr('Verses')}
          withBackIcon
          onClose={onClickCancel}
          onBack={onClickBack}
        />
        <VerticalRadioList
          label={tr('Select a Verse')}
          withUnderline={true}
          items={mockVerses}
          value={selectedVerse}
          onChange={handleChangeVerse}
        />
      </Stack>

      {questionCreatorBox}
    </Stack>
  );
}

export function VerseTranslatorQAPage() {
  const history = useHistory();
  // const { tr } = useTr();

  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const handleClickCancel = () => {
    history.push(RouteConst.TRANSLATOR_QA);
  };

  const handleClickBack = () => {
    setSelectedChapter(null);
  };

  const handleClickChapter = (chapter: string) => {
    setSelectedChapter(chapter);
  };

  return (
    <PageLayout>
      {selectedChapter ? (
        <VerseTranslatorQA
          onClickCancel={handleClickCancel}
          onClickBack={handleClickBack}
        />
      ) : (
        <ChapterList
          onClickCancel={handleClickCancel}
          onClickChapter={handleClickChapter}
        />
      )}
    </PageLayout>
  );
}
