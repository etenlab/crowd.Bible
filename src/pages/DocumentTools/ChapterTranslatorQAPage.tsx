import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { type Question } from '@eten-lab/ui-kit/dist/crowd-bible';

import { mockChapters } from './ChapterFeedbackPage';

import { useAppContext } from '@/hooks/useAppContext';

const { TitleWithIcon, VerticalRadioList, QuestionCreatorBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function ChapterTranslatorQAPage() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleChangeChapter = (
    _event: React.SyntheticEvent<Element, Event>,
    chapter: number,
  ) => {
    setSelectedChapter(chapter);
  };

  const handleClickCancel = () => {
    history.push('/translator-qa');
  };

  const handleCancel = () => {
    setSelectedChapter(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (question: Question) => {
    alertFeedback('success', 'Your question has been created!');
    history.push('/translator-qa');
  };

  const questionCreatorBox =
    selectedChapter !== null ? (
      <QuestionCreatorBox onSave={handleSave} onCancel={handleCancel} />
    ) : null;

  return (
    <IonContent>
      <Stack
        justifyContent="space-between"
        sx={{ height: 'calc(100vh - 68px)' }}
      >
        <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
          <TitleWithIcon
            label="Chapters"
            withBackIcon={false}
            onClose={handleClickCancel}
            onBack={() => {}}
          />
          <VerticalRadioList
            label="Select a chapter"
            withUnderline={true}
            items={mockChapters}
            value={selectedChapter}
            onChange={handleChangeChapter}
          />
        </Stack>

        {questionCreatorBox}
      </Stack>
    </IonContent>
  );
}
