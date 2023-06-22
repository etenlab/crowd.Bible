import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

import { FeedbackInput } from '@/components/FeedbackInput';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';

const { TitleWithIcon, VerticalRadioList } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export const mockChapters = [
  { value: '1', label: 'Chapter 1: Name of the Chapter' },
  { value: '2', label: 'Chapter 2: Name of the Chapter' },
  { value: '3', label: 'Chapter 3: Name of the Chapter' },
  { value: '4', label: 'Chapter 4: Name of the Chapter' },
  { value: '5', label: 'Chapter 5: Name of the Chapter' },
  { value: '6', label: 'Chapter 6: Name of the Chapter' },
  { value: '7', label: 'Chapter 7: Name of the Chapter' },
  { value: '8', label: 'Chapter 8: Name of the Chapter' },
  { value: '9', label: 'Chapter 9: Name of the Chapter' },
  { value: '10', label: 'Chapter 10: Name of the Chapter' },
  { value: '11', label: 'Chapter 11: Name of the Chapter' },
  { value: '12', label: 'Chapter 12: Name of the Chapter' },
];

export function ChapterFeedbackPage() {
  const history = useHistory();
  const { tr } = useTr();

  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const handleChangeChapter = (
    _event: React.SyntheticEvent<Element, Event>,
    chapter: string,
  ) => {
    setSelectedChapter(chapter);
  };

  const handleClickCancel = () => {
    history.push(RouteConst.FEEDBACK);
  };

  const feedbackInput = selectedChapter !== null ? <FeedbackInput /> : null;

  return (
    <PageLayout>
      <Stack
        justifyContent="space-between"
        sx={{ height: 'calc(100vh - 68px)' }}
      >
        <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
          <TitleWithIcon
            label={tr('Chapters')}
            withBackIcon={false}
            onClose={handleClickCancel}
            onBack={() => {}}
          />
          <VerticalRadioList
            label={tr('Select a chapter')}
            withUnderline={true}
            items={mockChapters}
            value={selectedChapter}
            onChange={handleChangeChapter}
          />
        </Stack>

        {feedbackInput}
      </Stack>
    </PageLayout>
  );
}
