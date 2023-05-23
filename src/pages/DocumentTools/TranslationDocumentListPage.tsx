import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  Button,
  BiFile,
  LangSelector,
  LanguageInfo,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { LanguageStatusBar } from '@/components/LanguageStatusBar';

import { DocumentDto } from '@/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';
import { useWordSequence } from '@/hooks/useWordSequence';
import { useTranslation } from '@/hooks/useTranslation';

import { compareLangInfo } from '@/utils/langUtils';

import { RouteConst } from '@/constants/route.constant';

const { Stack, Chip } = MuiMaterial;
const { ButtonList, HeadBox } = CrowdBibleUI;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function TranslationDocumentListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setSourceLanguage, setTargetLanguage, setLoadingState },
  } = useAppContext();

  const { listDocument } = useDocument();
  const { getWordSequenceByDocumentId } = useWordSequence();
  const { getRecommendedTranslationCandidateId } = useTranslation();

  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [items, setItems] = useState<ButtonListItemType[]>([]);

  // Fetch Document Lists from db
  useEffect(() => {
    if (singletons) {
      listDocument().then(setDocuments);
    }
  }, [listDocument, singletons, sourceLanguage]);

  useEffect(() => {
    (async () => {
      const items: ButtonListItemType[] = [];

      for (const document of documents) {
        const wordSequence = await getWordSequenceByDocumentId(document.id);

        if (!wordSequence) {
          continue;
        }

        const recommendedId = await getRecommendedTranslationCandidateId(
          wordSequence.id,
          wordSequence.languageInfo,
          sourceLanguage as LanguageInfo | undefined,
        );

        items.push({
          value: document.id,
          label: document.name,
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
          endIcon: !recommendedId && (
            <Chip
              component="span"
              label="Not translated"
              variant="outlined"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
            />
          ),
          disabled: !recommendedId,
        });
      }

      setItems(items);
    })();
  }, [
    documents,
    sourceLanguage,
    getWordSequenceByDocumentId,
    getRecommendedTranslationCandidateId,
  ]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickLanguageFilter = () => {
    setFilterOpen((open) => !open);
  };

  const handleClickSearchButton = () => {
    setFilterOpen(false);
  };

  const handleSetSourceLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    if (compareLangInfo(selected, sourceLanguage)) return;
    setSourceLanguage(selected);
  };

  const handleSetTargetLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    if (compareLangInfo(selected, sourceLanguage)) return;
    setTargetLanguage(selected);
  };

  const handleClickDocument = (documentId: string) => {
    history.push(`${RouteConst.TRANSLATION}/${documentId}`);
  };

  const langSelectorCom = filterOpen ? (
    <Stack gap="30px" sx={{ padding: '20px' }}>
      <LangSelector
        selected={sourceLanguage || undefined}
        onChange={handleSetSourceLanguage}
        setLoadingState={setLoadingState}
      />
      <LangSelector
        selected={targetLanguage || undefined}
        onChange={handleSetTargetLanguage}
        setLoadingState={setLoadingState}
      />
      <Button variant="contained" onClick={handleClickSearchButton}>
        Search
      </Button>
    </Stack>
  ) : null;

  const buttonListCom = !filterOpen ? (
    <Stack gap="16px">
      <LanguageStatusBar />
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
      />
    </Stack>
  ) : null;

  return (
    <IonContent>
      <HeadBox
        title="Documents"
        filter={{
          onClick: handleClickLanguageFilter,
        }}
      />
      {langSelectorCom}
      {buttonListCom}
    </IonContent>
  );
}
