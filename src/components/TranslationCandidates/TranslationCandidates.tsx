import { useState, Fragment } from "react";
import { useHistory } from "react-router";

import {
  Tabs,
  Button,
  MuiMaterial,
  Typography,
  colors,
  Checkbox,
  BiLeftArrowAlt,
  BiMessageRounded,
  BiDislike,
  BiLike,
  FiPlus,
} from "@eten-lab/ui-kit";

const { Box, Stack, Divider } = MuiMaterial;

const translations = [
  {
    id: 1,
    translation:
      "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 2,
    translation:
      "2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 3,
    translation:
      "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 4,
    translation:
      "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 5,
    translation:
      "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
];

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

function OpenDiscussion() {
  return (
    <span
      style={{
        padding: "5px",
        paddingBottom: 0,
        borderRadius: "4px",
        background: colors["light-blue"],
        color: colors["gray"],
        fontSize: "18px",
      }}
    >
      <BiMessageRounded />
    </span>
  );
}

export function TranslationCandidates() {
  const [currentTab, setCurrentTab] = useState<string>("all");
  const history = useHistory();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleClickAddMyTranslation = () => {
    history.push("/translation?mode=editing");
  };

  const handleBack = () => {
    history.push("/translation");
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Button variant="text" color="dark" onClick={handleBack}>
        <BiLeftArrowAlt style={{ fontSize: "24px" }} />
        Translation
      </Button>
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
      {translations.map((item) => (
        <Fragment key={item.id}>
          <Stack
            direction="row"
            alignItems="flex-start"
            sx={{ marginBottom: "12px" }}
          >
            <Checkbox sx={{ marginLeft: "-9px" }} />
            <Stack gap="3px">
              <Typography
                variant="body3"
                sx={{ padding: "9px 0", color: colors["dark"] }}
              >
                {item.translation}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Voting voted={item.voted} unvoted={item.unvoted} />
                <OpenDiscussion />
              </Stack>
            </Stack>
          </Stack>
          <Divider />
        </Fragment>
      ))}
    </Box>
  );
}
