import { useState } from "react";
import { useHistory } from "react-router";

import {
  Tabs,
  Button,
  MuiMaterial,
  Typography,
  colors,
  Checkbox,
  BiMessageRounded,
  BiDislike,
  BiLike,
  FiPlus,
} from "@eten-lab/ui-kit";

const { Stack, Divider, IconButton } = MuiMaterial;

function Voting({ voted, unvoted }: { voted: number; unvoted: number }) {
  return (
    <Stack direction="row" gap="20px">
      <span
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "5px",
          borderRadius: "4px",
          background: colors["light-green"],
          color: colors["green"],
          fontSize: "16px",
        }}
      >
        <BiLike style={{ fontSize: "18px" }} />
        {voted}
      </span>
      <span
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "5px",
          borderRadius: "4px",
          background: colors["light-red"],
          color: colors["red"],
          fontSize: "16px",
        }}
      >
        <BiDislike style={{ fontSize: "18px" }} />
        {unvoted}
      </span>
    </Stack>
  );
}

export function OpenDiscussion() {
  return (
    <span
      style={{
        padding: "5px",
        paddingBottom: 0,
        borderRadius: "4px",
        background: colors["light-blue"],
        color: colors["gray"],
        fontSize: "24px",
      }}
    >
      <BiMessageRounded />
    </span>
  );
}

export type TranslationType = {
  id: number;
  text: string;
  voted: number;
  unvoted: number;
};

function Translation({
  translation,
  isCheckbox,
}: {
  translation: TranslationType;
  isCheckbox: boolean;
}) {
  const { id, text, voted, unvoted } = translation;
  const history = useHistory();

  const handleClickDiscussionButton = () => {
    history.push(`/discussion/table-name/${text}/row/${id}`);
  };

  const checkbox = isCheckbox ? <Checkbox sx={{ marginLeft: "-9px" }} /> : null;

  return (
    <>
      <Stack
        direction="row"
        alignItems="flex-start"
        sx={{ marginBottom: "12px" }}
      >
        {checkbox}
        <Stack gap="3px">
          <Typography
            variant="body3"
            sx={{ padding: "9px 0", color: colors["dark"] }}
          >
            {text}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Voting voted={voted} unvoted={unvoted} />
            {/* <OpenDiscussion />
             */}
            <IconButton onClick={handleClickDiscussionButton}>
              <BiMessageRounded
                style={{
                  padding: "5px",
                  borderRadius: "4px",
                  background: colors["light-blue"],
                  color: colors["gray"],
                  fontSize: "26px",
                }}
              />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
    </>
  );
}

type TranslationListProps = {
  translations: TranslationType[];
  isCheckbox?: boolean;
};

export function TranslationList({
  translations,
  isCheckbox = true,
}: TranslationListProps) {
  const [currentTab, setCurrentTab] = useState<string>("all");
  const history = useHistory();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleClickAddMyTranslation = () => {
    history.push("/translation-edit");
  };

  return (
    <>
      <Tabs
        tabs={[
          { value: "all", label: "All Translations" },
          { value: "mine", label: "My Translations(2)" },
        ]}
        value={currentTab}
        onChange={handleTabChange}
      />
      {currentTab === "mine" ? (
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          fullWidth
          onClick={handleClickAddMyTranslation}
          sx={{ margin: "10px 0" }}
        >
          Add My Translation
        </Button>
      ) : null}

      <Stack sx={{ flexGrow: 1, overflowY: "scroll" }}>
        {translations.map((item) => (
          <Translation
            key={item.id}
            translation={item}
            isCheckbox={isCheckbox}
          />
        ))}
      </Stack>
    </>
  );
}
