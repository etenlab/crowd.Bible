import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { PageLayout } from '@/components/Layout';

import {
  MuiMaterial,
  CrowdBibleUI,
  PlusButton,
  BiFile,
  LangSelector,
  LanguageInfo,
} from '@eten-lab/ui-kit';

import { DocumentDto } from '@/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';
import { useTr } from '@/hooks/useTr';

import { compareLangInfo } from '@/utils/langUtils';
import { RouteConst } from '@/constants/route.constant';

import { LanguageStatus } from '@/components/LanguageStatusBar';

const { ButtonList, HeadBox } = CrowdBibleUI;
const { Box } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function DocumentsListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage },
    },
    actions: { setSourceLanguage, createLoadingStack },
  } = useAppContext();
  const { tr } = useTr();

  const { listDocument, listDocumentByLanguageInfo } = useDocument();

  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  // Fetch Document Lists from db
  useEffect(() => {
    if (singletons) {
      if (sourceLanguage) {
        listDocumentByLanguageInfo(sourceLanguage).then(setDocuments);
      } else {
        listDocument().then(setDocuments);
      }
    }
  }, [listDocument, singletons, listDocumentByLanguageInfo, sourceLanguage]);

  const { startLoading, stopLoading } = useMemo(
    () => createLoadingStack(),
    [createLoadingStack],
  );

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickLanguageFilter = () => {
    setFilterOpen((open) => !open);
  };

  const handleSetSourceLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    if (compareLangInfo(selected, sourceLanguage)) return;
    setSourceLanguage(selected);
  };

  const handleClickDocument = (documentId: string) => {
    history.push(`${RouteConst.DOCUMENTS_LIST}/${documentId}`);
  };

  const handleClickAddDocumentBtn = () => {
    history.push(`${RouteConst.ADD_DOCUMENT}`);
  };

  const handleLoadingState = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
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

  const langSelectorCom = filterOpen ? (
    <LangSelector
      label={tr('Select the source language')}
      selected={sourceLanguage || undefined}
      onChange={handleSetSourceLanguage}
      setLoadingState={handleLoadingState}
    />
  ) : null;

  return (
    <PageLayout>
      <HeadBox
        title={tr('Documents')}
        filter={{
          onClick: handleClickLanguageFilter,
        }}
      />
      <Box sx={{ padding: '20px' }}>
        <LanguageStatus lang={sourceLanguage} />
        {langSelectorCom}
      </Box>
      <ButtonList
        label={tr('List of Docs')}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: tr('Input Search Word...'),
        }}
        withUnderline={true}
        items={items}
        onClick={handleClickDocument}
        toolBtnGroup={
          <PlusButton variant="primary" onClick={handleClickAddDocumentBtn} />
        }
      />
    </PageLayout>
  );
}
