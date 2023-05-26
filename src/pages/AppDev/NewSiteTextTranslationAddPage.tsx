import { ChangeEventHandler, useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonContent } from '@ionic/react';
import { useDebounce } from 'use-debounce';

import {
  CrowdBibleUI,
  Input,
  TextArea,
  Button,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';

import { SiteTextTranslationDto, SiteTextDto } from '@/dtos/site-text.dto';

import { SelectableDefinitionCandidateList } from '@/components/SelectableDefinitionCandidateList';

import { RouteConst } from '@/constants/route.constant';

const { HeadBox } = CrowdBibleUI;
const { Stack, Typography, Divider } = MuiMaterial;

export function NewSiteTextTranslationAddPage() {
  const history = useHistory();
  const { appId, siteTextId, originalDefinitionRel, translatedDefinitionRel } =
    useParams<{
      appId: Nanoid;
      siteTextId: Nanoid;
      originalDefinitionRel: Nanoid;
      translatedDefinitionRel?: Nanoid;
    }>();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { alertFeedback },
  } = useAppContext();
  const {
    createOrFindTranslation,
    getSiteTextTranslationDtoWithRel,
    getSiteTextDtoWithRel,
  } = useSiteText();

  const [originalSiteText, setOriginalSiteText] = useState<SiteTextDto | null>(
    null,
  );
  const [siteText, setSiteText] = useState<SiteTextTranslationDto | null>(null);

  const [word, setWord] = useState<string>('');
  const [bouncedWord] = useDebounce(word, 1000);

  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (singletons && sourceLanguage) {
        let _siteText: SiteTextTranslationDto | null = null;
        let _originalSiteText: SiteTextDto | null = null;

        if (translatedDefinitionRel) {
          _siteText = await getSiteTextTranslationDtoWithRel(
            appId,
            originalDefinitionRel,
            translatedDefinitionRel,
          );

          if (!_siteText) {
            alertFeedback(
              'error',
              'Not exists site text for current translation relationship!',
            );
            history.push(
              `${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}/${originalDefinitionRel}/${translatedDefinitionRel}`,
            );
          }

          setSiteText(_siteText);
        } else {
          _originalSiteText = await getSiteTextDtoWithRel(
            originalDefinitionRel,
          );

          if (!_originalSiteText) {
            alertFeedback(
              'error',
              'Not exists site text for current original relationship!',
            );
            history.push(
              `${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}/${originalDefinitionRel}`,
            );
          }

          setOriginalSiteText(_originalSiteText);
        }
      }
    })();
  }, [
    singletons,
    appId,
    siteTextId,
    sourceLanguage,
    getSiteTextDtoWithRel,
    getSiteTextTranslationDtoWithRel,
    originalDefinitionRel,
    translatedDefinitionRel,
    alertFeedback,
    history,
  ]);

  const handleChangeWord: ChangeEventHandler<HTMLInputElement> = (event) => {
    setWord(event.target.value);
  };

  const handleChangeDescription: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeDescriptionForCandidateList = useCallback(
    (description: string) => {
      setDescription(description);
    },
    [],
  );

  const handleClickSave = async () => {
    if (targetLanguage) {
      await createOrFindTranslation(
        appId,
        originalDefinitionRel,
        targetLanguage,
        word,
        description,
      );
    } else {
      alertFeedback('error', 'Not exists or targetLanguage!');
    }

    console.log('new translated ==>', originalDefinitionRel, siteText);

    if (translatedDefinitionRel) {
      history.push(
        `${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}/${originalDefinitionRel}/${translatedDefinitionRel}`,
      );
    } else {
      history.push(
        `${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}/${originalDefinitionRel}`,
      );
    }
  };

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const selectableCandidateListCom = targetLanguage ? (
    <SelectableDefinitionCandidateList
      word={bouncedWord}
      languageInfo={targetLanguage}
      description={description}
      onChangeDescription={handleChangeDescriptionForCandidateList}
    />
  ) : null;

  const siteTextString =
    siteText?.translatedSiteText || originalSiteText?.siteText || '';
  const definitionString =
    siteText?.translatedDefinition || originalSiteText?.definition || '';

  return (
    <IonContent>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title="Add New Translation"
        extraNode={<Input value={siteTextString} disabled />}
      />
      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Typography variant="body1" color="text.dark">
          {definitionString}
        </Typography>

        <Input
          label="Translation"
          withLegend={false}
          value={word}
          onChange={handleChangeWord}
        />
        <TextArea
          label="Description of Translation"
          withLegend={false}
          value={description}
          onChange={handleChangeDescription}
        />

        <Button variant="contained" onClick={handleClickSave}>
          Save
        </Button>
        <Button variant="text" onClick={handleClickBackBtn}>
          Cancel
        </Button>
      </Stack>

      <Divider />

      {selectableCandidateListCom}
    </IonContent>
  );
}
