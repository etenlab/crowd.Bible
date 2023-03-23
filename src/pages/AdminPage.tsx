import React from 'react';

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

import useNodeServices from '@/hooks/useNodeServices';

import txtfile from '@/utils/iso-639-3.tab';
import { LoadingStatus } from '../enums';

export function AdminPage() {
  const nodeService = useNodeServices();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.INITIAL,
  );

  const [loadResult, setLoadResult] = useState('Load finished.');

  const addNewData = async () => {
    setLoadingStatus(LoadingStatus.LOADING);
    try {
      const res = await fetch(txtfile);
      const data = await res.text();
      if (!nodeService) {
        return;
      }
      if (!nodeService) {
        return;
      }
      const table = await nodeService.createTable('iso-639-3.tab');

      const rows = data.split('\r\n');
      const columns = rows.shift()?.split('\t');
      if (!columns) {
        return;
      }

      const col_ids = [],
        row_ids = [];
      for (const col of columns) {
        col_ids.push(await nodeService.createColumn(table, col));
      }
      console.log(col_ids);

      for (const row of rows) {
        const row_id = await nodeService.createRow(table);
        row_ids.push(row_id);
        const cells = row.split('\t');
        for (const [index, col_id] of col_ids.entries()) {
          const cell_id = await nodeService.createCell(
            col_id,
            row_id,
            cells[index],
          );
          console.log(cell_id);
        }
      }
    } catch (err) {
      console.log(err);
      setLoadResult('Error occured while loading.');
    }
    setLoadingStatus(LoadingStatus.FINISHED);
  };

  return (
    <IonContent>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Import</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton onClick={addNewData}>Load</IonButton>
        </IonCardContent>
      </IonCard>
      <IonLoading
        isOpen={loadingStatus === LoadingStatus.LOADING}
        onDidDismiss={() => setLoadingStatus(LoadingStatus.FINISHED)}
        message={'Loading table...'}
      />
      <IonToast
        isOpen={loadingStatus === LoadingStatus.FINISHED}
        color={loadResult === 'Load finished.' ? 'success' : 'danger'}
        message={loadResult}
        duration={5000}
      />
    </IonContent>
  );
}
