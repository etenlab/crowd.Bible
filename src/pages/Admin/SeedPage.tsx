import { useState } from 'react';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
} from '@ionic/react';

import langObj from '@/utils/lang.json';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { FeedbackTypes } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const langInfos = {
  en: {
    lang: {
      tag: 'en',
      descriptions: ['English'],
    },
  },
  jp: {
    lang: {
      tag: 'ja',
      descriptions: ['Japanese'],
    },
  },
  zh: {
    lang: {
      tag: 'zh',
      descriptions: ['Chinese'],
    },
  },
  hi: {
    lang: {
      tag: 'hi',
      descriptions: ['Hindi'],
    },
  },
  de: {
    lang: {
      tag: 'de',
      descriptions: ['German'],
    },
  },
};

export function SeedPage() {
  const {
    states: {
      global: { singletons, crowdBibleApp },
    },
    actions: { setLoadingState },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [loadResult, setLoadResult] = useState('');

  const seedOneSiteText = async () => {
    if (!singletons || !crowdBibleApp) {
      return true;
    }

    const keys = Object.keys(langObj);
    const obj: Record<string, Record<string, string>> = langObj;

    const temp = window.localStorage.getItem('processed-site-texts');
    const tempProcessedSiteTexts: string[] = temp ? JSON.parse(temp) : [];

    let flg = false;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      setLoadingState(
        true,
        `Seeding (${key})`,
        `${tempProcessedSiteTexts.length} / ${keys.length}`,
        true,
      );

      if (tempProcessedSiteTexts.find((data) => data === key)) {
        continue;
      }

      flg = true;

      const en = obj[key].en;
      const jp = obj[key].jp;
      const zh = obj[key].zh;
      const hi = obj[key].hi;
      const de = obj[key].de;

      try {
        const { relationshipId } =
          await singletons.siteTextService.createOrFindSiteText(
            crowdBibleApp.id,
            langInfos.en,
            en,
            '',
          );

        await singletons.siteTextService.createOrFindTranslation(
          crowdBibleApp.id,
          relationshipId,
          langInfos.jp,
          jp,
          '',
        );

        await singletons.siteTextService.createOrFindTranslation(
          crowdBibleApp.id,
          relationshipId,
          langInfos.zh,
          zh,
          '',
        );

        await singletons.siteTextService.createOrFindTranslation(
          crowdBibleApp.id,
          relationshipId,
          langInfos.hi,
          hi,
          '',
        );

        await singletons.siteTextService.createOrFindTranslation(
          crowdBibleApp.id,
          relationshipId,
          langInfos.de,
          de,
          '',
        );
      } catch (err) {
        logger.error('seeding partially failed::', err);
      }

      window.localStorage.setItem(
        'processed-site-texts',
        JSON.stringify([...tempProcessedSiteTexts, key]),
      );
      break;
    }

    if (!flg) {
      setLoadResult(`Total ${keys.length} / ${keys.length} loaded`);
      setLoadingState(false);
      return true;
    } else {
      return false;
    }
  };

  const materialize = async () => {
    singletons?.materializerService.materialize('iso_639_3_min.tab');
  };

  const seedSiteText = async () => {
    setTimeout(async () => {
      const result = await seedOneSiteText();
      if (result) {
        return;
      } else {
        seedSiteText();
      }
    }, 0);
  };

  return (
    <PageLayout>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Materialize Table')}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton onClick={materialize}>{tr('Materialize')}</IonButton>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Site Text Seed')}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton onClick={seedSiteText}>{tr('Seed')}</IonButton>
        </IonCardContent>
      </IonCard>
      <IonToast
        isOpen={!!loadResult}
        onDidDismiss={() => {
          setLoadResult('');
        }}
        color={
          loadResult.search(RegExp(/(error)/, 'gmi')) > -1
            ? 'danger'
            : FeedbackTypes.SUCCESS
        }
        message={loadResult}
        duration={5000}
      />
    </PageLayout>
  );
}
