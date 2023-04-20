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
  implemented?: boolean;
};

type LinkGroupType = {
  group: string;
  linkItems: LinkItemProps[];
};

export function LinkGroup({ group, linkItems }: LinkGroupType) {
  const {
    states: {
      global: { connectivity },
    },
  } = useAppContext();
  const { getColor } = useColorModeContext();
  const history = useHistory();

  const items = useMemo(() => {
    return linkItems.map(({ to, label, onlineOnly, implemented }) => ({
      value: to,
      label,
      color: implemented ? getColor('dark') : getColor('dark'), // we currently won't differentiate on this item for now
      isEndIcon: connectivity === false && onlineOnly === true ? true : false,
      disabled: connectivity === false && onlineOnly === true ? true : false,
    }));
  }, [linkItems, getColor, connectivity]);

  const handleClickItem = (value: string) => {
    history.push(value);
  };

  return (
    <ButtonList
      label={group}
      withUnderline
      items={items}
      endIcon={
        <Chip
          label="Online only"
          variant="outlined"
          color="error"
          size="small"
          sx={{ marginLeft: 2 }}
        />
      }
      onClick={handleClickItem}
    />
  );
}
