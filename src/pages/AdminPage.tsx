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
  IonPage,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import { gql, useApolloClient } from '@apollo/client';

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

  const addNewData = async () => {
    try {
      const res = await fetch(
        'https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab',
        // {
        //   mode: 'no-cors',
        // },
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <IonContent>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Import</IonCardTitle>
        </IonCardHeader>
      </IonCard>
      <IonButton onClick={addNewData}>Load</IonButton>
    </IonContent>
  );
}
