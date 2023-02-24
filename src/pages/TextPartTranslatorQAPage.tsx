import { useState } from "react";
import { useHistory } from "react-router-dom";

import { CrowdBibleUI, MuiMaterial, FiX } from "@eten-lab/ui-kit";
import { Question } from "@eten-lab/ui-kit/dist/crowd-bible";

import { mockDocument } from "./TranslationPage";

import { useAppContext } from "../hooks/useAppContext";

const { LabelWithIcon, RangeSelectableTextArea, QuestionCreatorBox } =
  CrowdBibleUI;
const { Stack, Box } = MuiMaterial;

export function TextPartTranslatorQAPage() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();

  const [range, setRange] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });

  const handleChangeRange = ({
    start,
    end,
  }: {
    start: number | null;
    end: number | null;
  }) => {
    setRange({ start, end });
  };

  const handleClickCancel = () => {
    history.push("/translator-qa");
  };

  const handleCancel = () => {
    handleChangeRange({ start: null, end: null });
  };

  const handleSave = (question: Question) => {
    alertFeedback("success", "Your question has been created!");
    history.push("/translator-qa");
  };

  const questionCreatorBox =
    range.start !== null && range.end !== null ? (
      <QuestionCreatorBox onSave={handleSave} onCancel={handleCancel} />
    ) : null;

  return (
    <Stack justifyContent="space-between" sx={{ height: "calc(100vh - 68px)" }}>
      <Box sx={{ padding: "20px 20px 0" }}>
        <LabelWithIcon
          label="translation"
          icon={<FiX />}
          color="gray"
          onClick={handleClickCancel}
        />
      </Box>

      <Stack sx={{ padding: "0 20px 20px", flexGrow: 1, overflowY: "scroll" }}>
        <RangeSelectableTextArea
          text={mockDocument}
          range={range}
          onChangeRange={handleChangeRange}
        />
      </Stack>
      {questionCreatorBox}
    </Stack>
  );
}
