import { useState, ChangeEventHandler, ReactNode } from 'react';

import {
  MuiMaterial,
  Typography,
  CiSearch,
  SearchInput,
} from '@eten-lab/ui-kit';

const {
  Stack,
  IconButton,
  List,
  ListSubheader,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} = MuiMaterial;

type Item = {
  id: string;
  label: string;
};

type ButtonListProps = {
  label: string;
  search?: {
    value: string;
    onChange(str: string): void;
    placeHolder: string;
  };
  toolBtnGroup: ReactNode;
  data: {
    icon?: ReactNode;
    list: Item[];
    onClick(id: string): void;
  };
};

type ListItemComProps = {
  onClick(): void;
  label: string;
  icon?: ReactNode;
};

function ListItemCom({ onClick, label, icon }: ListItemComProps) {
  const iconCom = icon ? <ListItemIcon>{icon}</ListItemIcon> : null;

  return (
    <ListItemButton sx={{ paddingLeft: 0, paddingRight: 0 }} onClick={onClick}>
      {iconCom}
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

export function ButtonList({
  label,
  search,
  toolBtnGroup,
  data,
}: ButtonListProps) {
  const [isShownSearchInput, setIsShownSearchInput] = useState<boolean>(false);

  const handleToggleSearchInput = () => {
    setIsShownSearchInput((shown) => !shown);
  };

  const handleChangeSearchInput: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    search?.onChange(event.target.value);
  };

  const searchBtnCom = search ? (
    <IconButton onClick={handleToggleSearchInput}>
      <CiSearch />
    </IconButton>
  ) : null;

  const searchInputCom =
    search && isShownSearchInput ? (
      <SearchInput
        label={search.placeHolder}
        value={search.value}
        onChange={handleChangeSearchInput}
        fullWidth
      />
    ) : null;

  const toolBtnComs =
    search || toolBtnGroup ? (
      <>
        {searchBtnCom}
        {toolBtnGroup}
      </>
    ) : null;

  return (
    <List
      component="nav"
      sx={{ padding: '20px' }}
      subheader={
        <ListSubheader component="div" sx={{ padding: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="overline" sx={{ opacity: 0.5 }}>
              {label}
            </Typography>
            {toolBtnComs}
          </Stack>
          {searchInputCom}
        </ListSubheader>
      }
    >
      {data.list.map(({ id, label }) => (
        <ListItemCom
          key={id}
          label={label}
          onClick={() => data.onClick(id)}
          icon={data.icon}
        />
      ))}
    </List>
  );
}
