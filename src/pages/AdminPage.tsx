import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToast,
} from '@ionic/react';

import { gql, useApolloClient } from '@apollo/client';

import useNodeServices from 'src/hooks/useNodeServices';

import txtfile from '../utils/iso-639-3.tab.txt';
import { LoadingStatus } from '../enums';

const queries = {
  sil_language_codes: gql`
    query GetLangCodes {
      sil_language_codes {
        code
        country_code
        id
        name
        status
      }
    }
  `,
  iso_639_2: gql`
    query GetLangCodes {
      iso_639_2 {
        id
        english_name
        entry_type
        french_name
        german_name
        iso_639_1
        iso_639_2
      }
    }
  `,
  glottolog_language: gql`
    query GetLangCodes {
      glottolog_language {
        id
        glottocode
        child_dialects
        name
        top_level_family
        macro_area
        longitude
        latitude
        iso_639_3
      }
    }
  `,
};

type QueriesKeyType = keyof typeof queries;

const fieldsObj = {
  sil_language_codes: [
    { field: 'id', filter: true },
    { field: 'code', filter: true },
    { field: 'country_code', filter: true },
    { field: 'name', filter: true },
    { field: 'status' },
  ],
  iso_639_2: [
    { field: 'id', filter: true },
    { field: 'english_name', filter: true },
    { field: 'entry_type', filter: true },
    { field: 'french_name', filter: true },
    { field: 'german_name', filter: true },
    { field: 'iso_639_1', filter: true },
    { field: 'iso_639_2' },
  ],
  glottolog_language: [
    { field: 'id', filter: true },
    { field: 'glottocode', filter: true },
    { field: 'child_dialects', filter: true },
    { field: 'name', filter: true },
    { field: 'top_level_family' },
    { field: 'macro_area' },
    { field: 'longitude' },
    { field: 'latitude' },
    { field: 'iso_639_3' },
  ],
};

type FieldsObjKeyType = keyof typeof fieldsObj;

export function AdminPage() {
  /*
  // return <IonContent>/admin</IonContent>;

  const [languageTable, setLanguageTable] = useState<
    QueriesKeyType | QueriesKeyType
  >('sil_language_codes');
  const client = useApolloClient();

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState<unknown>(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  // {"code":"aas","country_code":"TZ","id":15,"name":"Aasáx\r","status":"L","__typename":"sil_language_codes"}
  const [columnDefs, setColumnDefs] = useState<unknown>();

  const importToGraph = () => {};

  const loadData = async () => {
    const response = await client.query({ query: queries[languageTable] });
    setColumnDefs(fieldsObj[languageTable as FieldsObjKeyType]);
    setRowData(response.data[languageTable]);
  };
  */
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
      if (!nodeService.nodeService) {
        return;
      }
      const table = await nodeService.nodeService.createTable('iso-639-3.tab');

      const rows = data.split('\r\n');
      const columns = rows.shift()?.split('\t');
      if (!columns) {
        return;
      }

      const col_ids = [],
        row_ids = [];
      for (const col of columns) {
        col_ids.push(await nodeService.nodeService.createColumn(table, col));
      }
      console.log(col_ids);

      for (const row of rows) {
        const row_id = await nodeService.nodeService.createRow(table);
        row_ids.push(row_id);
        const cells = row.split('\t');
        for (const [index, col_id] of col_ids.entries()) {
          const cell_id = await nodeService.nodeService.createCell(
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
