import { IonPage, IonContent } from '@ionic/react';

import { AppHeader } from './AppHeader';

import { MuiMaterial, useColorModeContext } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';

import { SqlPortal } from '@/pages/DataTools/SqlRunner/SqlPortal';

const { Snackbar, CircularProgress, Backdrop, Stack, Alert } = MuiMaterial;

interface PageLayoutProps {
  children?: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const {
    states: {
      global: { snack, loading, singletons, isSqlPortalShown },
      components: { modal },
    },
    actions: { closeFeedback, clearModalCom },
  } = useAppContext();
  const { getColor } = useColorModeContext();

  const isLoading = loading || !singletons;

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
            zIndex: 999,
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
          sx={{ color: getColor('white'), zIndex: 1000 }}
          open={isLoading}
        >
          <Stack justifyContent="center">
            <div style={{ margin: 'auto' }}>
              <CircularProgress color="inherit" />
            </div>
            <div>LOADING</div>
          </Stack>
        </Backdrop>

        {isSqlPortalShown && <SqlPortal />}
      </IonContent>
    </IonPage>
  );
}
