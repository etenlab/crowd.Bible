import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, MuiMaterial, FiX } from '@eten-lab/ui-kit';

import { mockDocument, mockRanges } from './TranslationPage';

import { useAppContext } from '@/hooks/useAppContext';

const { DotsText, LabelWithIcon, QuestionBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

type QuestionType =
  | 'Normal'
  | 'Agree/Disagree'
  | 'True/False'
  | 'Multiselect'
  | 'Choose One';

export interface CheckItemType {
  item: string;
  checked: boolean;
}

const mockQuestion = [
  {
    id: 0,
    question:
      'From its medieval origins to the digital era, learn everything is to know about the ubiquitous?',
    questionKind: 'Normal',
  },
  {
    id: 1,
    question:
      'From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs?',
    questionKind: 'Agree/Disagree',
  },
  {
    id: 2,
    question:
      'From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs?',
    questionKind: 'True/False',
  },
  {
    id: 3,
    question:
      'From its medieval origins to the digital era, learn everything there is to know?',
    questionKind: 'Choose One',
    questionData: ['Laying', 'Typesetter', 'Attributed'],
  },
  {
    id: 4,
    question:
      'From its medieval origins to the digital era, learn everything there is to know?',
    questionKind: 'Multiselect',
    questionData: ['Laying', 'Typesetter', 'Attributed'],
  },
];

export function ReaderQAPage() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();
  const [questionId, setQuestionId] = useState<number | null>(null);

  const handleDotClick = (id: number) => {
    setQuestionId(id);
  };

  const handleCancelQuestion = () => {
    setQuestionId(null);
  };

  const handleSaveQuestion = ({
    normal,
    agreeOrDisagree,
    trueOrFalse,
    chooseOne,
    multiselect,
  }: {
    normal?: string;
    agreeOrDisagree?: boolean;
    trueOrFalse?: boolean;
    chooseOne?: string;
    multiselect?: CheckItemType[];
  }) => {
    alertFeedback('success', 'Your answer has been sent!');
    handleCancelQuestion();
  };

  const handleGoToTranslationPage = () => {
    history.push('/translation');
  };

  const selectedQuestion =
    questionId !== null ? mockQuestion[questionId] : null;

  const questionBox =
    selectedQuestion !== null ? (
      <QuestionBox
        question={selectedQuestion.question}
        questionKind={selectedQuestion.questionKind as QuestionType}
        questionData={selectedQuestion.questionData}
        onCancel={handleCancelQuestion}
        onSave={handleSaveQuestion}
      />
    ) : null;

  return (
    <IonContent>
      <Stack
        justifyContent="space-between"
        sx={{ height: 'calc(100vh - 68px)' }}
      >
        <Stack sx={{ padding: '20px', overflowY: 'auto' }}>
          <LabelWithIcon
            label="translation"
            icon={<FiX />}
            color="gray"
            onClick={handleGoToTranslationPage}
          />
          <DotsText
            text={mockDocument}
            ranges={mockRanges}
            onSelect={handleDotClick}
            dotColor="yellow"
            selectedColor="middle-yellow"
          />
        </Stack>
        <Stack sx={{ flexGrow: 1 }}>{questionBox}</Stack>
      </Stack>
    </IonContent>
  );
}
