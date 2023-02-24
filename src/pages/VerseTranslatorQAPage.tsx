import { useState } from "react";
import { useHistory } from "react-router-dom";

import { CrowdBibleUI, MuiMaterial } from "@eten-lab/ui-kit";
import { Question } from "@eten-lab/ui-kit/dist/crowd-bible";

import { useAppContext } from "../hooks/useAppContext";

import { mockVerses, ChapterList } from "./VerseFeedbackPage";

const { TitleWithIcon, VerticalRadioList, QuestionCreatorBox } = CrowdBibleUI;
const { Stack, Box } = MuiMaterial;

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
    verse: number
  ) => {
    setSelectedVerse(verse);
  };

  const handleCancel = () => {
    setSelectedVerse(null);
  };

  const handleSave = (question: Question) => {
    alertFeedback("success", "Your question has been created!");
    history.push("/translator-qa");
  };

  const questionCreatorBox =
    selectedVerse !== null ? (
      <QuestionCreatorBox onSave={handleSave} onCancel={handleCancel} />
    ) : null;

  return (
    <Stack justifyContent="space-between" sx={{ height: "calc(100vh - 68px)" }}>
      <Box sx={{ padding: "20px 20px 0 12px" }}>
        <TitleWithIcon
          label="Verses"
          withBackIcon
          onClose={onClickCancel}
          onBack={onClickBack}
        />
      </Box>

      <Stack sx={{ padding: "0 20px 20px", flexGrow: 1, overflowY: "scroll" }}>
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
    history.push("/translator-qa");
  };

  const handleClickBack = () => {
    setSelectedChapter(null);
  };

  const handleClickChapter = (chapter: number) => {
    setSelectedChapter(chapter);
  };

  return selectedChapter ? (
    <VerseTranslatorQA
      onClickCancel={handleClickCancel}
      onClickBack={handleClickBack}
    />
  ) : (
    <ChapterList
      onClickCancel={handleClickCancel}
      onClickChapter={handleClickChapter}
    />
  );
}
