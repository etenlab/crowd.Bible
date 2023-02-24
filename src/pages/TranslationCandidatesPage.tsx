import { useHistory } from "react-router";

import { Button, MuiMaterial, BiLeftArrowAlt } from "@eten-lab/ui-kit";

import {
  TranslationList,
  TranslationType,
} from "../components/TranslationList";

const { Stack } = MuiMaterial;

export const mockTranslations = [
  {
    id: 1,
    text: "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 2,
    text: "2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 3,
    text: "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 4,
    text: "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
  {
    id: 5,
    text: "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    voted: 42,
    unvoted: 15,
  },
] as TranslationType[];

export function TranslationCandidatesPage() {
  const history = useHistory();

  const GoToTranslationPage = () => {
    history.push("/translation");
  };

  return (
    <Stack
      sx={{ padding: "20px", height: "calc(100vh - 68px)" }}
      justifyContent="space-between"
    >
      <Button
        variant="text"
        color="dark"
        onClick={GoToTranslationPage}
        sx={{ width: "123px" }}
      >
        <BiLeftArrowAlt style={{ fontSize: "24px" }} />
        Translation
      </Button>
      <TranslationList translations={mockTranslations} />
    </Stack>
  );
}
