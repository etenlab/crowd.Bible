import { useHistory } from 'react-router-dom';
import { CrowdBibleUI, PlusButton } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

const { ButtonList, HeadBox } = CrowdBibleUI;

export function ApplicationsPage() {
  const history = useHistory();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickItem = (value: string) => {};

  const handleAddApp = () => {
    history.push(`${RouteConst.ADMIN}/create-application`);
  };

  const handleSearch = () => {};

  const items = [
    {
      label: 'Application Name 1',
      value: 'Application Name 1',
    },
    {
      label: 'Application Name 2',
      value: 'Application Name 2',
    },
  ];

  return (
    <PageLayout>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title="Applications"
        search={{
          onChange: handleSearch,
          placeHolder: 'Find applications',
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
            <PlusButton variant="primary" onClick={handleAddApp} />
          </>
        }
      />
    </PageLayout>
  );
}
