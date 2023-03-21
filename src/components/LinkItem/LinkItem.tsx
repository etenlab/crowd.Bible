import { IonItem } from '@ionic/react';

import { MuiMaterial, useColorModeContext } from '@eten-lab/ui-kit';
import { useAppContext } from '@/src/hooks/useAppContext';

const { Typography, Chip } = MuiMaterial;

export type LinkItemProps = {
  label: string;
  to: string;
  onlineOnly?: boolean;
};

export function LinkItem({ to, label, onlineOnly = false }: LinkItemProps) {
  const {
    states: {
      global: { connectivity },
    },
  } = useAppContext();
  const { getColor } = useColorModeContext();

  // console.log(onlineOnly);

  const disabled = connectivity === false && onlineOnly === true ? true : false;
  const chipComponent = disabled ? (
    <Chip
      label="Online only"
      variant="outlined"
      color="error"
      size="small"
      sx={{ marginLeft: 2 }}
    />
  ) : null;

  // console.log(disabled);

  return (
    <IonItem routerLink={to} disabled={disabled}>
      <Typography variant="body1" color="text.dark">
        {label}
      </Typography>
      {chipComponent}
    </IonItem>
  );
}
