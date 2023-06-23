import { useHistory } from 'react-router-dom';
import { CrowdBibleUI, PlusButton } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

const { ButtonList, HeadBox } = CrowdBibleUI;

export function OrganizationsPage() {
  const history = useHistory();
  const { tr } = useTr();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickItem = (value: string) => {
    history.push(`${RouteConst.ADMIN}/organization/${value}`);
  };

  const handleAddOrg = () => {
    history.push(`${RouteConst.ADMIN}/create-organization`);
  };

  const handleSearch = () => {};

  const items = [
    {
      label: 'Organization Name 1',
      value: 'Organization Name 1',
    },
    {
      label: 'Organization Name 2',
      value: 'Organization Name 2',
    },
    {
      label: 'Organization Name 3',
      value: 'Organization Name 3',
    },
  ];

  return (
    <PageLayout>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title={tr('Organizations')}
        search={{
          onChange: handleSearch,
          placeHolder: tr('Find organizations'),
          value: '',
        }}
      />
      <br />
      <ButtonList
        label={tr('List of Organizations')}
        withUnderline={true}
        items={items}
        onClick={handleClickItem}
        toolBtnGroup={
          <>
            <PlusButton variant="primary" onClick={handleAddOrg} />
          </>
        }
      />
    </PageLayout>
  );
}
