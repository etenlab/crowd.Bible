import { useState } from 'react';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonLoading,
  IonToast,
} from '@ionic/react';

import txtfile from '@/utils/iso_639_3_min.tab';
import { NodeTypeConst } from '../constants/graph.constant';
import { useAppContext } from '../hooks/useAppContext';
import { FeedbackTypes, LoadingStatuses } from '../constants/common.constant';

export function AdminPage() {
  const {
    states: {
      global: { singletons },
    },
    logger,
  } = useAppContext();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatuses>(
    LoadingStatuses.INITIAL,
  );
  const [syncInLoadingStatus, setSyncInLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);
  const [syncOutLoadingStatus, setSyncOutLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);

  const [loadResult, setLoadResult] = useState('');
  // const seedService = useSeedService();

  const [loadingMessage, setLoadingMessage] = useState('Loading table...');

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
    setSyncOutLoadingStatus(LoadingStatuses.LOADING);
    try {
      const syncOutRes = await singletons.syncService.syncOut();
      logger.error('syncOutRes', syncOutRes);
      setLoadResult('Syncing Out was successful!');
    } catch (error) {
      console.error('Error occurred while syncing out::', error);
      setLoadResult('Error occurred while syncing out.');
    } finally {
      setSyncOutLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const doSyncIn = async () => {
    if (!singletons?.syncService) return;
    setSyncInLoadingStatus(LoadingStatuses.LOADING);
    try {
      const syncInRes = await singletons.syncService.syncIn();
      logger.fatal('syncInRes', syncInRes);
      setLoadResult('Syncing In was successful!');
    } catch (error) {
      logger.fatal('Error occurred while syncing in::', error);
      setLoadResult('Error occurred while syncing in.');
    } finally {
      setSyncInLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const materialize = async () => {
    singletons?.materializerService.materialize('iso_639_3_min.tab');
  };

  return (
    <IonContent>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Import Partial ISO-639-3 Dataset</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton onClick={addNewData}>Load</IonButton>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Seed some random data</IonCardTitle>
        </IonCardHeader>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Sync Data</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            className="text-transform-none"
            onClick={doSyncIn}
            disabled={syncInLoadingStatus === LoadingStatuses.LOADING}
          >
            {syncInLoadingStatus === LoadingStatuses.LOADING
              ? 'Syncing In...'
              : 'Sync In'}
          </IonButton>
          <IonButton
            className="text-transform-none"
            onClick={doSyncOut}
            disabled={syncOutLoadingStatus === LoadingStatuses.LOADING}
          >
            {syncOutLoadingStatus === LoadingStatuses.LOADING
              ? 'Syncing Out...'
              : 'Sync Out'}
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Materialize Table</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton onClick={materialize}>Materialize</IonButton>
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
    </IonContent>
  );
}
