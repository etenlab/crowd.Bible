import { IonContent } from '@ionic/react';
import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

import { MuiMaterial, VersificationUI } from '@eten-lab/ui-kit';

const { Box } = MuiMaterial;
const { HeadingBox } = VersificationUI;

export function Layout({
  backRoute,
  breadcrumb,
  headerContent,
  children,
}: {
  backRoute?: string;
  breadcrumb?: string;
  headerContent?: ReactNode;
  children?: ReactNode;
}) {
  const history = useHistory();

  return (
    <IonContent>
      <HeadingBox
        breadcrumb={breadcrumb}
        {...(backRoute && {
          onClick: () => history.push(backRoute),
        })}
      >
        {headerContent}
      </HeadingBox>
      <Box
        sx={{
          p: '16px 20px',
          fontSize: 14,
        }}
      >
        {children}
      </Box>
    </IonContent>
  );
}
