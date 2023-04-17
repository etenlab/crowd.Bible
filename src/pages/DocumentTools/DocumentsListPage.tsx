import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent } from '@ionic/react';

import { CrowdBibleUI, PlusButton, BiFile } from '@eten-lab/ui-kit';

import { LanguageDto } from '@/dtos/language.dto';
import { DocumentDto } from '@/src/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useDocument } from '@/hooks/useDocument';

import { Link } from '@/components/Link';

const { ButtonList, HeadBox } = CrowdBibleUI;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function DocumentsListPage() {
  const history = useHistory();

  const { listDocument } = useDocument();
  const { getLanguages } = useLanguage();

  const [languageList, setLanguageList] = useState<LanguageDto[]>([]);
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');

  const {
    states: {
      global: { user, singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setSourceLanguage, setTargetLanguage },
  } = useAppContext();

  // Fetch language Lists from db
  useEffect(() => {
    if (singletons) {
      getLanguages().then(setLanguageList);
    }
  }, [singletons, getLanguages]);

  // Fetch Document Lists from db
  useEffect(() => {
    if (singletons) {
      listDocument().then(setDocuments);
    }
  }, [listDocument, singletons]);

  const handleSetSourceLanguage = (value: LanguageDto | null) => {
    setSourceLanguage(value);
  };

  const handleSetTargetLanguage = (value: LanguageDto | null) => {
    setTargetLanguage(value);
  };

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickDocument = (documentId: string) => {
    if (user?.role === 'translator') {
      history.push(`/translation/${documentId}`);
    } else if (user?.role === 'reader') {
      history.push(`/feedback/${documentId}`);
    }
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return documents.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }, [documents]);

  return (
    <IonContent>
      <HeadBox
        title="Documents"
        languageSelector={{
          languageList,
          source: sourceLanguage,
          target: targetLanguage,
          onChangeSource: handleSetSourceLanguage,
          onChangeTarget: handleSetTargetLanguage,
        }}
      />
      <ButtonList
        label="List of Docs"
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Input Search Word...',
        }}
        withUnderline={true}
        items={items}
        startIcon={
          <BiFile
            style={{
              borderRadius: '7px',
              padding: '7px',
              fontSize: '32px',
              background: '#E3EAF3',
            }}
          />
        }
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
