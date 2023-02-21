import { useState } from "react";
import { useHistory } from "react-router-dom";

import { IonContent } from "@ionic/react";

import {
  CrowdBibleUI,
  Typography,
  MuiMaterial,
  colors,
} from "@eten-lab/ui-kit";

import { PageLayout } from "../components/PageLayout";

const { DotsText } = CrowdBibleUI;
const { Box } = MuiMaterial;

const text =
  "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 5. From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim veniam, quis nostrud exercitation.";

const ranges = [
  {
    id: 0,
    start: 1,
    end: 10,
  },
  {
    id: 1,
    start: 15,
    end: 35,
  },
  {
    id: 2,
    start: 40,
    end: 60,
  },
  {
    id: 3,
    start: 65,
    end: 75,
  },
  {
    id: 3,
    start: 80,
    end: 90,
  },
];

export function TranslationPage() {
  const history = useHistory();

  const handleDotClick = (id: number) => {
    history.push("/translation-candidates");
  };

  return (
    <PageLayout
      content={
        <IonContent fullscreen>
          <Box sx={{ padding: "20px" }}>
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
            <DotsText
              text={text}
              ranges={ranges}
              onSelect={handleDotClick}
              dotColor="blue-primary"
              selectedColor="light-blue"
            />
          </Box>
        </IonContent>
      }
    />
  );
}
