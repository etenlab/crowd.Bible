import { useState } from "react";

import {
  CrowdBibleUI,
  Typography,
  MuiMaterial,
  colors,
} from "@eten-lab/ui-kit";

import { TranslationEditor } from "../components/TranslationEditor";

import { mockDocument } from "./TranslationPage";

const { RangeSelectableTextArea } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function TranslationEditPage() {
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

  const translationEdit =
    range.start !== null && range.end !== null ? <TranslationEditor /> : null;

  return (
    <Stack justifyContent="space-between" sx={{ height: "calc(100vh - 68px)" }}>
      <Stack sx={{ padding: "20px", flexGrow: 1, overflowY: "scroll" }}>
        <Typography
          variant="overline"
          sx={{
            paddingBottom: "16px",
            color: colors["dark"],
            opacity: 0.5,
          }}
        >
          Original
        </Typography>
        <RangeSelectableTextArea
          text={mockDocument}
          range={range}
          onChangeRange={handleChangeRange}
        />
      </Stack>
      <Stack sx={{ flexGrow: 1 }}>{translationEdit}</Stack>
    </Stack>
  );
}
