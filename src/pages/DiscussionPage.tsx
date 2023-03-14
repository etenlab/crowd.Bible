import { IonContent } from '@ionic/react';

import { useHistory, useParams } from 'react-router';

import {
  MuiMaterial,
  BiLeftArrowAlt,
  Typography,
  colors,
} from '@eten-lab/ui-kit';
import { DiscussionForDev } from '@eten-lab/discussion-box';
import { useAppContext } from '../hooks/useAppContext';

const { Stack, IconButton } = MuiMaterial;

export function DiscussionPage() {
  const history = useHistory();
  const {
    states: {
      global: { user },
    },
  } = useAppContext();
  const { table_name, row } = useParams<{ table_name: string; row: string }>();

  const goBack = () => {
    history.goBack();
  };

  const discussionUI =
    table_name.length > 0 && +row > 0 && user ? (
      <DiscussionForDev
        tableName={table_name.substring(0, 30)}
        rowId={+row}
        userEmail={user.userEmail}
        height="calc(100vh - 108px)"
      />
    ) : null;

  return (
    <IonContent>
      <Stack>
        <Stack direction="row" justifyContent="flex-start" alignItems="center">
          <IconButton onClick={goBack}>
            <BiLeftArrowAlt
              style={{ fontSize: '24px', color: colors['dark'] }}
            />
          </IconButton>
          <Typography
            variant="h2"
            sx={{
              color: colors['dark'],
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {table_name}
          </Typography>
        </Stack>
        {discussionUI}
      </Stack>
    </IonContent>
  );
}
