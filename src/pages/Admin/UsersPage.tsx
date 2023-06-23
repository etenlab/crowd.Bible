import { useHistory } from 'react-router-dom';
import { CrowdBibleUI, FilterButton, PlusButton } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

const { ButtonList, HeadBox } = CrowdBibleUI;

export function UsersPage() {
  const history = useHistory();
  const { tr } = useTr();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickItem = (value: string) => {
    history.push(`${RouteConst.ADMIN}/user/${value}`);
  };

  const handleSearch = () => {};

  const handleFilter = () => {
    history.push(`${RouteConst.ADMIN}/filter`);
  };

  const items = [
    {
      label: 'michael@test.com',
      value: 'michael@test.com',
    },
    {
      label: 'hiroshi@test.com',
      value: 'hiroshi@test.com',
    },
    {
      label: 'takeshi@test.com',
      value: 'takeshi@test.com',
    },
  ];

  return (
    <PageLayout>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title={tr('Users')}
        search={{
          onChange: handleSearch,
          placeHolder: tr('Find users'),
          value: '',
        }}
      />
      <br />
      <ButtonList
        label={tr('List of Users')}
        withUnderline={true}
        items={items}
        onClick={handleClickItem}
        toolBtnGroup={
          <>
            <FilterButton variant="secondary" onClick={handleFilter} />
            <PlusButton variant="primary" onClick={() => {}} />
          </>
        }
      />
    </PageLayout>
  );
}
