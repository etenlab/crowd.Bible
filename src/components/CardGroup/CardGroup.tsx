import { ReactNode, useMemo } from 'react';
import { useHistory } from 'react-router';

import { CrowdBibleUI } from '@eten-lab/ui-kit';

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
  const history = useHistory();

  const items = useMemo(() => {
    return linkItems
      .filter(({ adminOnly, betaOnly }) => {
        if (adminOnly === true) {
          return false;
        }
        if (betaOnly === true) {
          return false;
        }
        return true;
      })
      .map(({ to, title, description, startIcon, onlineOnly }) => ({
        value: to,
        title,
        description,
        startIcon,
        disabled: false,
      }));
  }, [linkItems]);

  const handleClickItem = (value: string) => {
    history.push(value);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <CardsMenu
      label={group}
      items={items}
      onClick={handleClickItem}
      marginTop="20px"
    />
  );
}
