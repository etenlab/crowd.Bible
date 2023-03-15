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

const queries: any = {
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

const fieldsObj: any = {
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

export function AdminPage() {
  // return <IonContent>/admin</IonContent>;

  const [languageTable, setLanguageTable] = useState('');
  const client = useApolloClient();

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  // {"code":"aas","country_code":"TZ","id":15,"name":"Aasáx\r","status":"L","__typename":"sil_language_codes"}
  const [columnDefs, setColumnDefs] = useState<any>();

  const importToGraph = () => {};

  const loadData = async () => {
    console.log(languageTable);
    const response = await client.query({ query: queries[languageTable] });
    setColumnDefs(fieldsObj[languageTable]);
    setRowData(response.data[languageTable]);
  };

  return (
    <IonContent>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Import</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <IonSelect
            onIonChange={(e: any) => setLanguageTable(e.detail.value)}
            placeholder="Select Language Table"
          >
            <IonSelectOption value="sil_language_codes">
              Sil Language Codes
            </IonSelectOption>
            <IonSelectOption value="iso_639_2">ISO</IonSelectOption>
            <IonSelectOption value="glottolog_language">
              Glottolog
            </IonSelectOption>
          </IonSelect>
        </IonCardContent>
      </IonCard>

      <IonButton onClick={loadData}>Load Data</IonButton>
      <IonButton onClick={importToGraph}>Import</IonButton>
      <div className="ag-theme-alpine" style={{ width: '100%', height: 500 }}>
        {/* <AgGridReact
            rowData={rowData} // Row Data for Rows

            columnDefs={columnDefs} // Column Defs for Columns
            //  defaultColDef={defaultColDef} // Default Column Properties

            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='multiple' // Options - allows click selection of rows

            onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        /> */}
      </div>
    </IonContent>
  );
}
