import { IonPage, IonContent } from '@ionic/react';

import { AppHeader } from './AppHeader';

import { MuiMaterial } from '@eten-lab/ui-kit';

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
    },
    actions: { closeFeedback },
  } = useAppContext();

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

        <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={isLoading}>
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
