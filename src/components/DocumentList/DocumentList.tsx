import { useState } from "react";
import {
  MuiMaterial,
  Typography,
  colors,
  CiSearch,
  SearchInput,
  BiFile,
} from "@eten-lab/ui-kit";

const {
  Stack,
  IconButton,
  List,
  ListSubheader,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} = MuiMaterial;

const documents = [
  "Document #1",
  "Document #2",
  "Document #3",
  "Document #4",
  "Document #5",
];

export function DocumentList() {
  const [isShownSearchInput, setIsShownSearchInput] = useState<boolean>(false);

  const handleToggleSearchInput = () => {
    setIsShownSearchInput((shown) => !shown);
  };

  return (
    <List
      component="nav"
      sx={{ padding: "20px" }}
      subheader={
        <ListSubheader component="div" sx={{ padding: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="overline"
              sx={{ color: colors["gray"], opacity: 0.5 }}
            >
              List of docs
            </Typography>
            <IconButton onClick={handleToggleSearchInput}>
              <CiSearch />
            </IconButton>
          </Stack>
          {isShownSearchInput ? (
            <SearchInput label="Find the document" fullWidth />
          ) : null}
        </ListSubheader>
      }
    >
      {documents.map((doc) => (
        <ListItemButton key={doc} sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <ListItemIcon>
            <BiFile
              style={{
                borderRadius: "7px",
                padding: "7px",
                fontSize: "32px",
                background: colors["light-blue"],
              }}
            />
          </ListItemIcon>
          <ListItemText primary={doc} />
        </ListItemButton>
      ))}
    </List>
  );
}
