import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

import { FeedbackInput } from '@/components/FeedbackInput';
import { mockChapters } from './ChapterFeedbackPage';

const { TitleWithIcon, VerticalRadioList, ButtonList } = CrowdBibleUI;
const { Stack } = MuiMaterial;

interface ChapterListProps {
  onClickChapter: (chapter: string) => void;
  onClickCancel: () => void;
}

export function ChapterList({
  onClickChapter,
  onClickCancel,
}: ChapterListProps) {
  return (
    <Stack justifyContent="space-between" sx={{ height: 'calc(100vh - 68px)' }}>
      <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
        <TitleWithIcon
          label="Chapters"
          withBackIcon={false}
          onClose={onClickCancel}
          onBack={() => {}}
        />
        <ButtonList
          withUnderline
          label="Select a Chapter"
          items={mockChapters}
          onClick={onClickChapter}
        />
      </Stack>
    </Stack>
  );
}

export const mockVerses = [
  {
    value: '1',
    label: 'Ch. 1: Verse 1 Name of the Verse',
  },
  {
    value: '2',
    label: 'Ch. 2: Verse 2 Name of the Verse',
  },
  {
    value: '3',
    label: 'Ch. 3: Verse 3 Name of the Verse',
  },
  {
    value: '4',
    label: 'Ch. 4: Verse 4 Name of the Verse',
  },
  {
    value: '5',
    label: 'Ch. 5: Verse 5 Name of the Verse',
  },
  {
    value: '6',
    label: 'Ch. 6: Verse 6 Name of the Verse',
  },
  {
    value: '7',
    label: 'Ch. 7: Verse 1 Name of the Verse',
  },
  {
    value: '8',
    label: 'Ch. 8: Verse 2 Name of the Verse',
  },
  {
    value: '9',
    label: 'Ch. 9: Verse 3 Name of the Verse',
  },
  {
    value: '10',
    label: 'Ch. 10: Verse 4 Name of the Verse',
  },
  {
    value: '11',
    label: 'Ch. 11: Verse 5 Name of the Verse',
  },
  {
    value: '12',
    label: 'Ch. 12: Verse 6 Name of the Verse',
  },
];

interface VerseFeedbackProps {
  onClickCancel: () => void;
  onClickBack: () => void;
}

function VerseFeedback({ onClickCancel, onClickBack }: VerseFeedbackProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  const handleChangeVerse = (
    _event: React.SyntheticEvent<Element, Event>,
    verse: number,
  ) => {
    setSelectedVerse(verse);
  };

  const feedbackInput = selectedVerse !== null ? <FeedbackInput /> : null;

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

      {feedbackInput}
    </Stack>
  );
}

export function VerseFeedbackPage() {
  const history = useHistory();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const handleClickCancel = () => {
    history.push('/feedback');
  };

  const handleClickBack = () => {
    setSelectedChapter(null);
  };

  const handleClickChapter = (chapter: string) => {
    setSelectedChapter(chapter);
  };

  return (
    <IonContent>
      {selectedChapter ? (
        <VerseFeedback
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
