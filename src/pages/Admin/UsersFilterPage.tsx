import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CrowdBibleUI, MuiMaterial, Button } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { CheckboxList } from '@/components/CheckboxList';

import { useTr } from '@/hooks/useTr';

import { nanoid } from 'nanoid';

const { HeadBox } = CrowdBibleUI;
const { Stack, Typography } = MuiMaterial;

const orgs = [
  'All',
  'Organization Name 1',
  'Organization Name 2',
  'Organization Name 3',
];
const apps = ['All', 'Application Name 1'];

type Item = {
  checked: boolean;
  label: string;
  id: string;
};

export function UsersFilterPage() {
  const history = useHistory();
  const { tr } = useTr();

  const [orgItems, setOrgItems] = useState<Item[]>(() => {
    return orgs.map((o: string) => ({
      id: nanoid(),
      checked: false,
      label: o,
    }));
  });

  const [appItems, setAppItems] = useState<Item[]>(() => {
    return apps.map((o: string) => ({
      id: nanoid(),
      checked: false,
      label: o,
    }));
  });

  const handleOrgChange = (
    _event: React.SyntheticEvent,
    newValue: boolean,
    id: string,
  ) => {
    setOrgItems((prev) => {
      return prev.map((o: Item) => {
        if (o.id === id) {
          return {
            ...o,
            checked: newValue,
          };
        }
        return o;
      });
    });
  };

  const handleAppChange = (
    _event: React.SyntheticEvent,
    newValue: boolean,
    id: string,
  ) => {
    setAppItems((prev) => {
      return prev.map((o: Item) => {
        if (o.id === id) {
          return {
            ...o,
            checked: newValue,
          };
        }
        return o;
      });
    });
  };

  const handleApply = () => {
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <PageLayout>
      <HeadBox title={tr('Choose Filters')} />
      <Stack sx={{ padding: '8px 20px' }} gap="20px">
        <Stack gap="40px">
          <CheckboxList
            items={orgItems}
            label={tr('ORGANIZATION')}
            onChange={handleOrgChange}
            withUnderline
            underlineColor="#5C66730A"
          />
          <CheckboxList
            items={appItems}
            label={tr('APPLICATION')}
            onChange={handleAppChange}
            withUnderline
            underlineColor="#5C66730A"
          />
        </Stack>
        <Stack gap="12px">
          <Button
            variant="contained"
            color="blue-primary"
            size="large"
            sx={{ alignItems: 'center' }}
            onClick={handleApply}
          >
            {tr('Apply')}
          </Button>
          <Button
            variant="text"
            size="large"
            color="gray"
            onClick={handleCancel}
          >
            <Typography
              variant="subtitle2"
              color="text.gray"
              sx={{ fontWeight: 500 }}
            >
              {tr('Cancel')}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
