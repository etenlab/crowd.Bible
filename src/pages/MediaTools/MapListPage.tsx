//!!!i'll work with it
import { IonContent } from '@ionic/react';
import { useState } from 'react';
import { CrowdBibleUI } from '@eten-lab/ui-kit';
import { MapListComponent } from './MapListPageComponents/MapListComponent';
import { MapWordsListComponent } from './MapListPageComponents/MapWordsListComponent';
const { HeadBox, ToggleButtons } = CrowdBibleUI;
//#region types

enum Modes {
  MAP = 'Map',
  WORD_LIST = 'Word List',
}

export const MapListPage = () => {
  const [selectedMode, setSelectedMode] = useState<Modes | null>(Modes.MAP);

  return (
    <IonContent>
      <HeadBox back={{ action: () => alert('back!') }} title="Map translator" />

      <ToggleButtons
        buttonsParams={[
          { caption: Modes.MAP, value: Modes.MAP },
          { caption: Modes.WORD_LIST, value: Modes.WORD_LIST },
        ]}
        onChange={(v) => setSelectedMode(v as Modes)}
        buttonSxProps={{
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
          marginLeft: '0 !important',
          marginRight: '0 !important',
          borderRadius: '3px !important',
        }}
      />

      {selectedMode === Modes.MAP ? <MapListComponent /> : null}
      {selectedMode === Modes.WORD_LIST ? <MapWordsListComponent /> : null}
    </IonContent>
  );
};
