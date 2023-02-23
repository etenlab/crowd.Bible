import { useState } from "react";
import { useHistory } from "react-router-dom";

import { CrowdBibleUI, MuiMaterial } from "@eten-lab/ui-kit";

const { AgreeConfirm, SimpleQuill } = CrowdBibleUI;
const { Box } = MuiMaterial;

export function FeedbackInput() {
  const history = useHistory();
  const [optionalFeedback, setOptionalFeedback] = useState<string>("");

  const handleChangeOptionalFeedback = (newValue: string) => {
    setOptionalFeedback(newValue);
  };

  const handleSubmitFeedback = (agree: "agree" | "disagree") => {
    alert(
      JSON.stringify(
        { feedback: { opinion: agree, optional: optionalFeedback } },
        null,
        2
      )
    );
    history.push("/feedback");
  };

  return (
    <Box>
      <AgreeConfirm onClick={handleSubmitFeedback} />
      <SimpleQuill
        value={optionalFeedback}
        onChange={handleChangeOptionalFeedback}
      />
    </Box>
  );
}
