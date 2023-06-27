import { useHistory } from 'react-router-dom';
import { CrowdBibleUI, PlusButton } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

const { ButtonList, HeadBox } = CrowdBibleUI;

export function ApplicationsPage() {
  const history = useHistory();
  const { tr } = useTr();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickItem = (_value: string) => {};

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
        title={tr('Applications')}
        search={{
          onChange: handleSearch,
          placeHolder: tr('Find applications'),
          value: '',
        }}
      />
      <br />
      <ButtonList
        label={tr('List of Applications')}
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
