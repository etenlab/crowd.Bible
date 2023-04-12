// import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, PlusButton } from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

// import { LanguageDto } from '@/dtos/language.dto';

const { HeadBox, ButtonList } = CrowdBibleUI;

const MockApps = [
  { value: '1', label: 'App Name 1' },
  { value: '2', label: 'App Name 2' },
  { value: '3', label: 'App Name 3' },
];

// const MockLanguageList = [
//   { id: '1', name: 'English' },
//   { id: '2', name: 'Spanish' },
//   { id: '3', name: 'Danish' },
// ];

export function ApplicationsListPage() {
  const history = useHistory();

  // const [source, setSource] = useState<LanguageDto | null>(null);
  // const [target, setTarget] = useState<LanguageDto | null>(null);

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickPlusBtn = () => {
    console.log('Clicked Plus Btn');
  };

  const handleClickItem = (value: unknown) => {
    history.push(RouteConst.SITE_TEXT_LIST);
  };

  // const handleChangeSource = (lang: LanguageDto | null) => {
  //   setSource(lang);
  // };

  // const handleChangeTarget = (lang: LanguageDto | null) => {
  //   setTarget(lang);
  // };

  return (
    <IonContent>
      <HeadBox back={{ action: handleClickBackBtn }} title="Applications" />
      <ButtonList
        label="Select a chapter"
        withUnderline
        items={MockApps}
        toolBtnGroup={
          <PlusButton variant="primary" onClick={handleClickPlusBtn} />
        }
        onClick={handleClickItem}
      />
    </IonContent>
  );
}
