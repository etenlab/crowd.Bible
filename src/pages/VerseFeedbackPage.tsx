import { useState } from "react";
import { useHistory } from "react-router-dom";

import { CrowdBibleUI, MuiMaterial } from "@eten-lab/ui-kit";

import { FeedbackInput } from "../components/FeedbackInput";
import { mockChapters } from "./ChapterFeedbackPage";

const { TitleWithIcon, VerticalRadioList, ButtonList } = CrowdBibleUI;
const { Stack, Box } = MuiMaterial;

type ChapterListProps = {
  onClickChapter(chapter: number): void;
  onClickCancel(): void;
};

export function ChapterList({
  onClickChapter,
  onClickCancel,
}: ChapterListProps) {
  return (
    <Stack justifyContent="space-between" sx={{ height: "calc(100vh - 68px)" }}>
      <Box sx={{ padding: "20px 20px 0" }}>
        <TitleWithIcon
          label="Chapters"
          withBackIcon={false}
          onClose={onClickCancel}
          onBack={() => {}}
        />
      </Box>

      <Stack sx={{ padding: "0 20px 20px", flexGrow: 1, overflowY: "scroll" }}>
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
    value: 1,
    label: "Ch. 1: Verse 1 Name of the Verse",
  },
  {
    value: 2,
    label: "Ch. 2: Verse 2 Name of the Verse",
  },
  {
    value: 3,
    label: "Ch. 3: Verse 3 Name of the Verse",
  },
  {
    value: 4,
    label: "Ch. 4: Verse 4 Name of the Verse",
  },
  {
    value: 5,
    label: "Ch. 5: Verse 5 Name of the Verse",
  },
  {
    value: 6,
    label: "Ch. 6: Verse 6 Name of the Verse",
  },
];

type VerseFeedbackProps = {
  onClickCancel(): void;
  onClickBack(): void;
};

function VerseFeedback({ onClickCancel, onClickBack }: VerseFeedbackProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  const handleChangeVerse = (
    _event: React.SyntheticEvent<Element, Event>,
    verse: number
  ) => {
    setSelectedVerse(verse);
  };

  const feedbackInput = selectedVerse !== null ? <FeedbackInput /> : null;

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

      {feedbackInput}
    </Stack>
  );
}

export function VerseFeedbackPage() {
  const history = useHistory();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleClickCancel = () => {
    history.push("/feedback");
  };

  const handleClickBack = () => {
    setSelectedChapter(null);
  };

  const handleClickChapter = (chapter: number) => {
    setSelectedChapter(chapter);
  };

  return selectedChapter ? (
    <VerseFeedback
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
