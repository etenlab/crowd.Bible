import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent } from '@ionic/react';

import { CrowdBibleUI, PlusButton, BiFile } from '@eten-lab/ui-kit';

import { DocumentDto } from '@/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';

import { Link } from '@/components/Link';
import { LanguageSelectionBox } from '@/components/LanguageSelectionBox';

const { ButtonList } = CrowdBibleUI;
// const { ButtonList, HeadBox } = CrowdBibleUI;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function DocumentsListPage() {
  const history = useHistory();

  const { listDocument } = useDocument();

  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');

  const {
    states: {
      global: { user, singletons },
      // documentTools: { sourceLanguage, targetLanguage },
    },
    // actions: { setSourceLanguage, setTargetLanguage },
  } = useAppContext();

  // Fetch Document Lists from db
  useEffect(() => {
    if (singletons) {
      listDocument().then(setDocuments);
    }
  }, [listDocument, singletons]);

  // const handleSetSourceLanguage = (value: LanguageDto | null) => {
  //   setSourceLanguage(value);
  // };

  // const handleSetTargetLanguage = (value: LanguageDto | null) => {
  //   setTargetLanguage(value);
  // };

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickDocument = (documentId: string) => {
    if (user?.roles.includes('translator')) {
      history.push(`/translation/${documentId}`);
    } else if (user?.roles.includes('reader')) {
      history.push(`/feedback/${documentId}`);
    }
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return documents.map(({ id, name }) => ({
      value: id,
      label: name,
      startIcon: (
        <BiFile
          style={{
            borderRadius: '7px',
            padding: '7px',
            fontSize: '32px',
            background: '#E3EAF3',
          }}
        />
      ),
    }));
  }, [documents]);

  return (
    <IonContent>
      {/* <HeadBox
        title="Documents"
        languageSelector={{
          languageList,
          source: sourceLanguage,
          target: targetLanguage,
          onChangeSource: handleSetSourceLanguage,
          onChangeTarget: handleSetTargetLanguage,
        }}
      /> */}
      <LanguageSelectionBox />
      <ButtonList
        label="List of Docs"
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Input Search Word...',
        }}
        withUnderline={true}
        items={items}
        onClick={handleClickDocument}
        toolBtnGroup={
          <Link to="/add-document">
            <PlusButton variant="primary" onClick={() => {}} />
          </Link>
        }
      />
    </IonContent>
  );
}
