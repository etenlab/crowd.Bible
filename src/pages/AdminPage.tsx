import { useCallback, useState } from 'react';

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

import { useSingletons } from '@/hooks/useSingletons';

import txtfile from '@/utils/iso-639-3-min.tab';
import { LoadingStatus } from '../enums';
import useSeedService from '../hooks/useSeedService';

export function AdminPage() {
  const singletons = useSingletons();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.INITIAL,
  );
  const [syncInLoadingStatus, setSyncInLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.INITIAL,
  );
  const [syncOutLoadingStatus, setSyncOutLoadingStatus] =
    useState<LoadingStatus>(LoadingStatus.INITIAL);

  const [loadResult, setLoadResult] = useState('');
  const seedService = useSeedService();

  const addNewData = async () => {
    setLoadingStatus(LoadingStatus.LOADING);
    try {
      const res = await fetch(txtfile);
      const data = await res.text();
      if (!singletons) {
        return;
      }
      const table = await singletons.tableService.createTable(
        'iso-639-3-min.tab',
      );

      const rows = data.split('\r\n');
      const columns = rows.shift()?.split('\t');
      if (!columns) {
        return;
      }

      const col_ids = [],
        row_ids = [];
      for (const col of columns) {
        col_ids.push(await singletons.tableService.createColumn(table, col));
      }
      console.log(col_ids);

      for (const row of rows) {
        const row_id = await singletons.tableService.createRow(table);
        row_ids.push(row_id);
        const cells = row.split('\t');
        for (const [index, col_id] of col_ids.entries()) {
          const cell_id = await singletons.tableService.createCell(
            col_id,
            row_id,
            cells[index],
          );
          console.log(cell_id);
        }
      }

      setLoadResult('Load finished.');
    } catch (err) {
      console.log(err);
      setLoadResult('Error occurred while loading.');
    } finally {
      setLoadingStatus(LoadingStatus.FINISHED);
    }
  };

  const doSyncOut = async () => {
    if (!singletons?.syncService) return;
    setSyncOutLoadingStatus(LoadingStatus.LOADING);
    try {
      const syncOutRes = await singletons.syncService.syncOut();
      console.log('syncOutRes', syncOutRes);
      setLoadResult('Syncing Out was successful!');
    } catch (error) {
      console.error('Error occurred while syncing out::', error);
      setLoadResult('Error occurred while syncing out.');
    } finally {
      setSyncOutLoadingStatus(LoadingStatus.FINISHED);
    }
  };

  const doSyncIn = async () => {
    if (!singletons?.syncService) return;
    setSyncInLoadingStatus(LoadingStatus.LOADING);
    try {
      const syncInRes = await singletons.syncService.syncIn();
      console.log('syncInRes', syncInRes);
      setLoadResult('Syncing In was successful!');
    } catch (error) {
      console.error('Error occurred while syncing in::', error);
      setLoadResult('Error occurred while syncing in.');
    } finally {
      setSyncInLoadingStatus(LoadingStatus.FINISHED);
    }
  };

  const seedLandgData = useCallback(async () => {
    if (seedService) {
      setLoadingStatus(LoadingStatus.LOADING);
      await seedService.seedLanguages();
      setLoadingStatus(LoadingStatus.FINISHED);
    }
  }, [seedService]);

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
        <IonCardContent>
          {seedService && (
            <IonButton onClick={seedLandgData}>Seed Languages</IonButton>
          )}
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Sync Data</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            className="text-transform-none"
            onClick={doSyncIn}
            disabled={syncInLoadingStatus === LoadingStatus.LOADING}
          >
            {syncInLoadingStatus === LoadingStatus.LOADING
              ? 'Syncing In...'
              : 'Sync In'}
          </IonButton>
          <IonButton
            className="text-transform-none"
            onClick={doSyncOut}
            disabled={syncOutLoadingStatus === LoadingStatus.LOADING}
          >
            {syncOutLoadingStatus === LoadingStatus.LOADING
              ? 'Syncing Out...'
              : 'Sync Out'}
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonLoading
        isOpen={loadingStatus === LoadingStatus.LOADING}
        onDidDismiss={() => setLoadingStatus(LoadingStatus.FINISHED)}
        message={'Loading table...'}
      />
      <IonToast
        isOpen={!!loadResult}
        onDidDismiss={() => {
          setLoadResult('');
        }}
        color={
          loadResult.search(RegExp(/(error)/, 'gmi')) > -1
            ? 'danger'
            : 'success'
        }
        message={loadResult}
        duration={5000}
      />
    </IonContent>
  );
}
