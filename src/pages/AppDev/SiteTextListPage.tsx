import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, PlusButton } from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { LanguageDto } from '@/dtos/language.dto';

const { HeadBox, ButtonList } = CrowdBibleUI;

const MockApps = [
  { value: '1', label: 'Lorem' },
  { value: '2', label: 'Ipsum' },
  { value: '3', label: 'Example' },
  { value: '4', label: 'Word' },
  { value: '5', label: 'Lorem' },
  { value: '6', label: 'Ipsum' },
  { value: '7', label: 'Example' },
  { value: '8', label: 'Word' },
  { value: '9', label: 'Lorem' },
  { value: '10', label: 'Ipsum' },
  { value: '11', label: 'Example' },
  { value: '12', label: 'Word' },
  { value: '13', label: 'Lorem' },
  { value: '14', label: 'Ipsum' },
  { value: '15', label: 'Example' },
  { value: '16', label: 'Word' },
  { value: '17', label: 'Lorem' },
  { value: '18', label: 'Ipsum' },
  { value: '19', label: 'Example' },
  { value: '20', label: 'Word' },
  { value: '21', label: 'Lorem' },
  { value: '22', label: 'Ipsum' },
  { value: '23', label: 'Example' },
  { value: '24', label: 'Word' },
];

const MockLanguageList = [
  { id: '1', name: 'English' },
  { id: '2', name: 'Spanish' },
  { id: '3', name: 'Danish' },
];

export function SiteTextListPage() {
  const history = useHistory();

  const [source, setSource] = useState<LanguageDto | null>(null);
  const [target, setTarget] = useState<LanguageDto | null>(null);
  const [searchStr, setSearchStr] = useState<string>('');

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickPlusBtn = () => {
    history.push(RouteConst.SITE_TEXT_EDITOR);
  };

  const handleClickItem = (value: unknown) => {
    history.push(RouteConst.SITE_TEXT_DETAIL);
  };

  const handleChangeSource = (lang: LanguageDto | null) => {
    setSource(lang);
  };

  const handleChangeTarget = (lang: LanguageDto | null) => {
    setTarget(lang);
  };

  return (
    <IonContent>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title="App Name 1"
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Search Site Text...',
        }}
        languageSelector={{
          languageList: MockLanguageList,
          source,
          target,
          onChangeSource: handleChangeSource,
          onChangeTarget: handleChangeTarget,
        }}
      />
      <ButtonList
        label="List of site text"
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
