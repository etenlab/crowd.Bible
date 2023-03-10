import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { Question } from '@eten-lab/ui-kit/dist/crowd-bible';

import { useAppContext } from '../hooks/useAppContext';

import { mockVerses, ChapterList } from './VerseFeedbackPage';

const { TitleWithIcon, VerticalRadioList, QuestionCreatorBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

type VerseFeedbackProps = {
  onClickCancel(): void;
  onClickBack(): void;
};

function VerseTranslatorQA({ onClickCancel, onClickBack }: VerseFeedbackProps) {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();

  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  const handleChangeVerse = (
    _event: React.SyntheticEvent<Element, Event>,
    verse: number,
  ) => {
    setSelectedVerse(verse);
  };

  const handleCancel = () => {
    setSelectedVerse(null);
  };

  const handleSave = (question: Question) => {
    alertFeedback('success', 'Your question has been created!');
    history.push('/translator-qa');
  };

  const questionCreatorBox =
    selectedVerse !== null ? (
      <QuestionCreatorBox onSave={handleSave} onCancel={handleCancel} />
    ) : null;

  return (
    <Stack justifyContent="space-between" sx={{ height: 'calc(100vh - 68px)' }}>
      <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
        <TitleWithIcon
          label="Verses"
          withBackIcon
          onClose={onClickCancel}
          onBack={onClickBack}
        />
        <VerticalRadioList
          label="Select a Verse"
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
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleClickCancel = () => {
    history.push('/translator-qa');
  };

  const handleClickBack = () => {
    setSelectedChapter(null);
  };

  const handleClickChapter = (chapter: number) => {
    setSelectedChapter(chapter);
  };

  return (
    <IonContent>
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
    </IonContent>
  );
}
