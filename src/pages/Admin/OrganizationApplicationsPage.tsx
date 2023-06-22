import { useHistory, useParams } from 'react-router-dom';
import {
  CrowdBibleUI,
  PlusButton,
  //  FilterButton
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

const { ButtonList, HeadBox } = CrowdBibleUI;

export function OrganizationApplicationsPage() {
  const history = useHistory();
  const { orgId } = useParams<{ orgId: string }>();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickItem = (value: string) => {};

  const handleSearch = () => {};

  // const handleFilter = () => {
  //   history.push(`${RouteConst.ADMIN}/filter`);
  // };

  const handleAddOrg = () => {
    history.push(
      `${RouteConst.ADMIN}/organization/${orgId}/create-application`,
    );
  };

  const items = [
    {
      label: 'Application Name 1',
      value: 'Application Name 1',
    },
    {
      label: 'Application Name 2',
      value: 'Application Name 2',
    },
    {
      label: 'Application Name 3',
      value: 'Application Name 3',
    },
  ];

  return (
    <PageLayout>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title={orgId}
        search={{
          onChange: handleSearch,
          placeHolder: 'Find users',
          value: '',
        }}
      />
      <br />
      <ButtonList
        label="List of Applications"
        withUnderline={true}
        items={items}
        onClick={handleClickItem}
        toolBtnGroup={
          <>
            {/* <FilterButton variant="secondary" onClick={handleFilter} /> */}
            <PlusButton variant="primary" onClick={handleAddOrg} />
          </>
        }
      />
    </PageLayout>
  );
}
