import { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  CrowdBibleUI,
  MuiMaterial,
  Typography,
  Button,
  colors,
} from "@eten-lab/ui-kit";

import { useAppContext } from "../hooks/useAppContext";
import { RoleType } from "../reducers/global.reducer";

const { VerticalRadioList } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export const roles = [
  { value: "translator", label: "Translator Role" },
  { value: "reader", label: "Reader Role" },
];

export function SettingsPage() {
  const history = useHistory();
  const {
    states: {
      global: { role },
    },
    actions: { setRole },
  } = useAppContext();

  const [selectedRole, setSelectedRole] = useState<RoleType>(role);

  const handleChangeRole = (
    _event: React.SyntheticEvent<Element, Event>,
    role: RoleType
  ) => {
    setSelectedRole(role);
  };

  const handleClickSave = () => {
    setRole(selectedRole);
    history.push("/documents-list");
  };

  return (
    <Stack sx={{ padding: "20px" }} gap="20px">
      <Typography variant="h2" sx={{ color: colors["dark"] }}>
        Settings
      </Typography>
      <VerticalRadioList
        label="Choose Role"
        withUnderline={true}
        items={roles}
        value={selectedRole}
        onChange={handleChangeRole}
      />
      <Button
        variant="contained"
        fullWidth
        color="blue-primary"
        onClick={handleClickSave}
        sx={{ marginBottom: "5px !important" }}
      >
        Save
      </Button>
    </Stack>
  );
}
