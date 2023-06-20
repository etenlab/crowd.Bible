import { useHistory } from 'react-router-dom';
import { CrowdBibleUI, FilterButton, PlusButton } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

const { ButtonList, HeadBox } = CrowdBibleUI;

export function UsersPage() {
  const history = useHistory();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickItem = (value: string) => {
    history.push(`${RouteConst.ADMIN}/user/${value}`);
  };

  const handleSearch = () => {};

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
        title="Users"
        search={{
          onChange: handleSearch,
          placeHolder: 'Find users',
          value: '',
        }}
      />
      <br />
      <ButtonList
        label="List of Users"
        withUnderline={true}
        items={items}
        onClick={handleClickItem}
        toolBtnGroup={
          <>
            <FilterButton variant="secondary" onClick={() => {}} />
            <PlusButton variant="primary" onClick={() => {}} />
          </>
        }
      />
    </PageLayout>
  );
}
