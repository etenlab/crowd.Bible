import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import {
  CrowdBibleUI,
  useColorModeContext,
  MuiMaterial,
} from '@eten-lab/ui-kit';
import { useAppContext } from '@/hooks/useAppContext';

const { ButtonList } = CrowdBibleUI;
const { Chip } = MuiMaterial;

export type LinkItemProps = {
  label: string;
  to: string;
  onlineOnly?: boolean;
  adminOnly?: boolean;
  betaOnly?: boolean;
  implemented?: boolean;
  noAuthOnly?: boolean;
};

type LinkGroupType = {
  group: string;
  linkItems: LinkItemProps[];
};

export function LinkGroup({ group, linkItems }: LinkGroupType) {
  const {
    states: {
      global: { mode, connectivity, user },
    },
  } = useAppContext();
  const { getColor } = useColorModeContext();
  const history = useHistory();

  const items = useMemo(() => {
    return linkItems
      .filter(({ adminOnly, betaOnly, noAuthOnly }) => {
        if (mode?.admin === false && adminOnly === true) {
          return false;
        }
        if (mode?.beta === false && betaOnly === true) {
          return false;
        }
        if (noAuthOnly === true) {
          if (!user) {
            return true;
          }
          if (user.userEmail.trim().length > 0) {
            return false;
          }
        }
        return true;
      })
      .map(({ to, label, onlineOnly, implemented }) => ({
        value: to,
        label,
        color: implemented ? getColor('dark') : getColor('dark'),
        endIcon:
          connectivity === false && onlineOnly === true ? (
            <Chip
              label="Online only"
              variant="outlined"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
            />
          ) : null,
        disabled: connectivity === false && onlineOnly === true ? true : false,
      }));
  }, [linkItems, mode, getColor, connectivity, user]);

  const handleClickItem = (value: string) => {
    history.push(value);
  };

  return (
    <ButtonList
      label={group}
      withUnderline
      items={items}
      onClick={handleClickItem}
    />
  );
}
