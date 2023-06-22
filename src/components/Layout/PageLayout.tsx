import { IonPage, IonContent } from '@ionic/react';

import { AppHeader } from './AppHeader';

import {
  MuiMaterial,
  Typography,
  useColorModeContext,
  Button,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { SqlPortal } from '@/pages/DataTools/SqlRunner/SqlPortal';

const { Snackbar, CircularProgress, Backdrop, Stack, Alert } = MuiMaterial;

interface PageLayoutProps {
  children?: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const {
    states: {
      global: { snack, loading, singletons, isSqlPortalShown, crowdBibleApp },
      components: { modal },
    },
    actions: { closeFeedback, clearModalCom, setLoadingState },
  } = useAppContext();
  const { getColor } = useColorModeContext();
  const { tr } = useTr();

  const handleClickCancelBtn = () => {
    setLoadingState(false);
  };

  const isLoading = !!loading || !singletons || !crowdBibleApp;
  const loadingMessage =
    loading?.message ||
    (!singletons && tr('Loading Singletons')) ||
    (!crowdBibleApp && tr('Loading App Data')) ||
    tr('Loading');

  return (
    <IonPage id="crowd-bible-app">
      <AppHeader kind="page" />

      <IonContent fullscreen className="crowd-bible-ion-content">
        {children}

        <Snackbar
          open={snack.open}
          autoHideDuration={5000}
          onClose={closeFeedback}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{
            top: '70px !important',
          }}
          key="top-center"
        >
          <Alert
            variant="standard"
            onClose={closeFeedback}
            severity={snack.severity}
            sx={{ width: '100%' }}
          >
            {snack.message}
          </Alert>
        </Snackbar>

        <Backdrop
          open={!!modal}
          sx={{
            alignItems: 'flex-start',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 900,
            marginTop: '61px',
          }}
          onClick={() => {
            clearModalCom();
          }}
        >
          <Stack
            sx={{
              width: '100%',
              background: getColor('disabled'),
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {modal}
          </Stack>
        </Backdrop>

        <Backdrop
          sx={{ zIndex: 1000, color: getColor('white') }}
          open={isLoading}
        >
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ maxWidth: '80%' }}
          >
            <CircularProgress color="inherit" />
            <Typography variant="body1" color="text.white">
              {loadingMessage}
            </Typography>
            {loading?.status ? (
              <Typography variant="body2" color="text.white">
                {loading?.status}
              </Typography>
            ) : null}
            {loading?.isCancelButton ? (
              <Button variant="text" onClick={handleClickCancelBtn}>
                {tr('Cancel')}
              </Button>
            ) : null}
          </Stack>
        </Backdrop>

        {isSqlPortalShown && <SqlPortal />}
      </IonContent>
    </IonPage>
  );
}
