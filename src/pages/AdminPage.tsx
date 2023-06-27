import { useState, useEffect } from 'react';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonLoading,
  IonToast,
} from '@ionic/react';

import txtfile from '@/utils/iso_639_3_min.tab';
import langObj from '@/utils/lang.json';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { NodeTypeConst } from '@/constants/graph.constant';
import { FeedbackTypes, LoadingStatuses } from '@/constants/common.constant';

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

export function AdminPage() {
  const {
    states: {
      global: { singletons, crowdBibleApp },
    },
    actions: { createLoadingStack, alertFeedback },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatuses>(
    LoadingStatuses.INITIAL,
  );
  const [syncInLoadingStatus, setSyncInLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);
  const [syncOutLoadingStatus, setSyncOutLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);

  const [loadResult, setLoadResult] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Loading table...');
  const [seeding, setSeeding] = useState<boolean>(false);
  const [processedSiteTexts, setProcessedSiteTexts] = useState<string[]>([]);

  useEffect(() => {
    (async function partialSeeding() {
      if (!seeding || !singletons || !crowdBibleApp) {
        return;
      }

      const keys = Object.keys(langObj);
      const obj: Record<string, Record<string, string>> = langObj;

      const temp = window.localStorage.getItem('processed-site-texts');
      const tempProcessedSiteTexts: string[] = temp ? JSON.parse(temp) : [];

      let flg = false;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        const { startLoading, stopLoading } = createLoadingStack(
          `Seeding (${key})`,
          `${tempProcessedSiteTexts.length} / ${keys.length}`,
          true,
        );

        startLoading();

        if (tempProcessedSiteTexts.find((data) => data === key)) {
          stopLoading();
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
          console.error('seeding partially failed::', err);
          logger.error('seeding partially failed::', err);
        }

        window.localStorage.setItem(
          'processed-site-texts',
          JSON.stringify([...tempProcessedSiteTexts, key]),
        );
        setProcessedSiteTexts([...tempProcessedSiteTexts, key]);

        stopLoading();
        break;
      }

      if (!flg) {
        setLoadResult(`Total ${keys.length} / ${keys.length} loaded`);
      }
    })();
  }, [
    crowdBibleApp,
    logger,
    processedSiteTexts,
    seeding,
    createLoadingStack,
    singletons,
  ]);

  const addNewData = async () => {
    setLoadingStatus(LoadingStatuses.LOADING);
    try {
      const res = await fetch(txtfile);
      const data = await res.text();
      if (!singletons) {
        return;
      }

      setLoadingMessage('Creating table...');
      const table = await singletons.tableService.createTable(
        'iso_639_3_min.tab',
      );

      const rows = data.split(/\r?\n/);
      const columns = rows.shift()?.split('\t');
      if (!columns) {
        return;
      }

      setLoadingMessage('Creating columns...');
      const col_ids: string[] = [],
        row_ids = [];
      for (const col of columns) {
        col_ids.push(await singletons.tableService.createColumn(table, col));
      }

      for (const [row_index, row] of rows.entries()) {
        setLoadingMessage('Checking if the row already exists...');
        const cells = row.split('\t');
        const existing_row = await singletons.tableService.getRow(
          table,
          async () => {
            const table_rows =
              await singletons.graphFirstLayerService.getNodesByTypeAndRelatedNodes(
                {
                  type: NodeTypeConst.TABLE_ROW,
                  from_node_id: table,
                },
              );
            for (const table_row of table_rows) {
              for (const [index, col_id] of col_ids.entries()) {
                const val = await singletons.tableService.readCell(
                  col_id,
                  table_row.id,
                );
                if (cells[index] !== val) {
                  break;
                }
                if (index === col_ids.length - 1) {
                  return table_row.id;
                }
              }
            }
            return null;
          },
        );
        if (existing_row) {
          logger.error('table-row: ', existing_row, ' already exists');
          continue;
        }
        const row_id = await singletons.tableService.createRow(table);
        row_ids.push(row_id);
        for (const [col_index, col_id] of col_ids.entries()) {
          setLoadingMessage(
            `${row_index * col_ids.length + columns.length} of ${
              rows.length * columns.length
            } table cells Loaded...`,
          );
          await singletons.tableService.createCell(
            col_id,
            row_id,
            cells[col_index],
          );
        }
      }

      setLoadResult('Load finished.');
    } catch (err) {
      logger.error(err);
      setLoadResult('Error occurred while loading.');
    } finally {
      setLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const doSyncOut = async () => {
    if (!singletons?.syncService) return;

    const { startLoading, stopLoading } = createLoadingStack();

    startLoading();

    setSyncOutLoadingStatus(LoadingStatuses.LOADING);
    try {
      const syncOutRes = await singletons.syncService.syncOut();
      logger.info('syncOutRes: ', syncOutRes);
      setLoadResult('Syncing Out was successful!');
    } catch (error) {
      logger.error('Error occurred while syncing out::', error);
      setLoadResult('Error occurred while syncing out.');
    } finally {
      stopLoading();
      setSyncOutLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const doSyncIn = async () => {
    if (!singletons?.syncService) return;
    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();
    setSyncInLoadingStatus(LoadingStatuses.LOADING);
    try {
      await singletons.syncService.syncIn();
      logger.info('sync done.');
      setLoadResult('Syncing In was successful!');
    } catch (error) {
      logger.fatal(
        'Error occurred while syncing in: ',
        JSON.stringify((error as Error).message),
      );
      setLoadResult('Error occurred while syncing in.');
    } finally {
      stopLoading();
      setSyncInLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const materialize = async () => {
    singletons?.materializerService.materialize('iso_639_3_min.tab');
  };

  const handleResetLocalGraphData = async () => {
    if (!singletons) return false;
    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();
    try {
      await singletons.dbService.resetAllData();
      singletons.syncService.clearAllSyncInfo();
      alertFeedback(FeedbackTypes.SUCCESS, 'All database data deleted.');
    } catch (error) {
      logger.error(
        { at: 'handleResetLocalGraphData' },
        'Error when resetting data',
      );
    } finally {
      stopLoading();
    }
  };

  const seedSiteText = async () => {
    setSeeding(true);
  };

  return (
    <PageLayout>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Import Partial ISO-639-3 Dataset')}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton onClick={addNewData}>{tr('Load')}</IonButton>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Seed some random data')}</IonCardTitle>
        </IonCardHeader>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Sync Data')}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            className="text-transform-none"
            onClick={doSyncIn}
            disabled={syncInLoadingStatus === LoadingStatuses.LOADING}
          >
            {syncInLoadingStatus === LoadingStatuses.LOADING
              ? tr('Syncing In...')
              : tr('Sync In')}
          </IonButton>
          <IonButton
            className="text-transform-none"
            onClick={doSyncOut}
            disabled={syncOutLoadingStatus === LoadingStatuses.LOADING}
          >
            {syncOutLoadingStatus === LoadingStatuses.LOADING
              ? tr('Syncing Out...')
              : tr('Sync Out')}
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Delete all local data')}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            className="text-transform-none"
            onClick={handleResetLocalGraphData}
          >
            {tr('Reset Local Data')}
          </IonButton>
        </IonCardContent>
      </IonCard>
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
      <IonLoading
        isOpen={loadingStatus === LoadingStatuses.LOADING}
        onDidDismiss={() => setLoadingStatus(LoadingStatuses.FINISHED)}
        message={loadingMessage}
        spinner={'lines'}
      />
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
