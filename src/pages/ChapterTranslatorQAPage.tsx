import { useState } from "react";
import { useHistory } from "react-router-dom";

import { CrowdBibleUI, MuiMaterial } from "@eten-lab/ui-kit";
import { Question } from "@eten-lab/ui-kit/dist/crowd-bible";

import { mockChapters } from "./ChapterFeedbackPage";

import { useAppContext } from "../hooks/useAppContext";

const { TitleWithIcon, VerticalRadioList, QuestionCreatorBox } = CrowdBibleUI;
const { Stack, Box } = MuiMaterial;

export function ChapterTranslatorQAPage() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleChangeChapter = (
    _event: React.SyntheticEvent<Element, Event>,
    chapter: number
  ) => {
    setSelectedChapter(chapter);
  };

  const handleClickCancel = () => {
    history.push("/translator-qa");
  };

  const handleCancel = () => {
    setSelectedChapter(null);
  };

  const handleSave = (question: Question) => {
    alertFeedback("success", "Your question has been created!");
    history.push("/translator-qa");
  };

  const questionCreatorBox =
    selectedChapter !== null ? (
      <QuestionCreatorBox onSave={handleSave} onCancel={handleCancel} />
    ) : null;

  return (
    <Stack justifyContent="space-between" sx={{ height: "calc(100vh - 68px)" }}>
      <Box sx={{ padding: "20px 20px 0" }}>
        <TitleWithIcon
          label="Chapters"
          withBackIcon={false}
          onClose={handleClickCancel}
          onBack={() => {}}
        />
      </Box>

      <Stack sx={{ padding: "0 20px 20px", flexGrow: 1, overflowY: "scroll" }}>
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
  );
}
