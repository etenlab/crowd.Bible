import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  MuiMaterial,
  Typography,
  useColorModeContext,
  CiSearch,
  SearchInput,
  BiFile,
} from '@eten-lab/ui-kit';
import { useAppContext } from '../../hooks/useAppContext';

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
  'Document #1',
  'Document #2',
  'Document #3',
  'Document #4',
  'Document #5',
  'Document #6',
  'Document #7',
  'Document #8',
  'Document #9',
  'Document #10',
];

export function DocumentList() {
  const history = useHistory();
  const {
    states: {
      global: { user },
    },
  } = useAppContext();
  const { getColor } = useColorModeContext();

  console.log(user);

  const [isShownSearchInput, setIsShownSearchInput] = useState<boolean>(false);

  const handleToggleSearchInput = () => {
    setIsShownSearchInput((shown) => !shown);
  };

  const handleClickDocument = () => {
    alert('clicked');
    alert(user?.role);
    if (user?.role === 'translator') {
      history.push('/translation');
    } else if (user?.role === 'reader') {
      history.push('/feedback');
    }
  };

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
        <ListItemButton
          key={doc}
          sx={{ paddingLeft: 0, paddingRight: 0 }}
          onClick={handleClickDocument}
        >
          <ListItemIcon>
            <BiFile
              style={{
                borderRadius: '7px',
                padding: '7px',
                fontSize: '32px',
                background: getColor('light-blue'),
              }}
            />
          </ListItemIcon>
          <ListItemText primary={doc} />
        </ListItemButton>
      ))}
    </List>
  );
}
