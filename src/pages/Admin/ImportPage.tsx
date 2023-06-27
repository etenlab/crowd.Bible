import { useState } from 'react';

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

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { NodeTypeConst } from '@/constants/graph.constant';
import { FeedbackTypes, LoadingStatuses } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

export function ImportPage() {
  const {
    states: {
      global: { singletons },
    },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatuses>(
    LoadingStatuses.INITIAL,
  );

  const [loadResult, setLoadResult] = useState('');
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
