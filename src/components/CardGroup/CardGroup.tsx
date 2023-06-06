import { ReactNode, useMemo } from 'react';
import { useHistory } from 'react-router';

import { CrowdBibleUI } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
const { CardsMenu } = CrowdBibleUI;

export type CardItemProps = {
  to: string;
  title: string;
  description: string;
  startIcon: ReactNode;
  disabled?: boolean;
  onlineOnly?: boolean;
  adminOnly?: boolean;
  betaOnly?: boolean;
  implemented?: boolean;
};

type CardGroupType = {
  group: string;
  linkItems: CardItemProps[];
};

export function CardGroup({ group, linkItems }: CardGroupType) {
  const {
    states: {
      global: { mode, connectivity },
    },
  } = useAppContext();
  const history = useHistory();

  const items = useMemo(() => {
    return linkItems
      .filter(({ adminOnly, betaOnly }) => {
        if (mode?.admin === false && adminOnly === true) {
          return false;
        }
        if (mode?.beta === false && betaOnly === true) {
          return false;
        }
        return true;
      })
      .map(({ to, title, description, startIcon, onlineOnly }) => ({
        value: to,
        title,
        description,
        startIcon,
        disabled: connectivity === false && onlineOnly === true ? true : false,
      }));
  }, [linkItems, mode, connectivity]);

  const handleClickItem = (value: string) => {
    history.push(value);
  };

  if (items.length === 0) {
    return null;
  }

  return <CardsMenu label={group} items={items} onClick={handleClickItem} />;
}
