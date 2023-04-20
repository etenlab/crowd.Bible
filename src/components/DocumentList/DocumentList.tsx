import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import {
  MuiMaterial,
  Typography,
  useColorModeContext,
  CiSearch,
  SearchInput,
  BiFile,
} from '@eten-lab/ui-kit';
import { DocumentDto } from '@/src/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';

const {
  Stack,
  IconButton,
  List,
  ListSubheader,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} = MuiMaterial;

export function DocumentList() {
  const history = useHistory();
  const {
    states: {
      global: { user, singletons },
    },
  } = useAppContext();
  const { getColor } = useColorModeContext();
  const { listDocument } = useDocument();

  const [isShownSearchInput, setIsShownSearchInput] = useState<boolean>(false);
  const [documents, setDocuments] = useState<DocumentDto[]>([]);

  useEffect(() => {
    if (singletons) {
      listDocument().then(setDocuments);
    }
  }, [listDocument, singletons]);

  const handleToggleSearchInput = () => {
    setIsShownSearchInput((shown) => !shown);
  };

  const handleClickDocument = (documentId: Nanoid) => {
    if (user?.roles.includes('translator')) {
      history.push(`/translation/${documentId}`);
    } else if (user?.roles.includes('reader')) {
      history.push(`/feedback/${documentId}`);
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
      {documents.map(({ id, name }) => (
        <ListItemButton
          key={id}
          sx={{ paddingLeft: 0, paddingRight: 0 }}
          onClick={() => handleClickDocument(id)}
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
          <ListItemText primary={name} />
        </ListItemButton>
      ))}
    </List>
  );
}
