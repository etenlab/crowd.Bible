import { IonItem, IonLabel, IonList } from '@ionic/react';
import { Box } from '@mui/material';
import { Button, CrowdBibleUI } from '@eten-lab/ui-kit';
const { TitleWithIcon } = CrowdBibleUI;
//#region types
enum eProcessStatus {
  NONE = 'NONE',
  PARSING_STARTED = 'PARSING_STARTED',
  PARSING_COMPLETED = 'PARSING_COMPLETED',
  COMPLETED = 'SAVED_IN_DB',
  FAILED = 'FAILED',
}

type tMapDetail = {
  id?: string;
  tempId?: string;
  status: eProcessStatus;
  words?: string[];
  map?: string;
  name?: string;
  langId?: string;
};
//#endregion

//#region data
const PADDING = 15;
//#endregion

export const MapListComponent = ({
  mapList,
}: {
  mapList: Array<tMapDetail>;
}) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      alignItems={'start'}
      paddingTop={`${PADDING}px`}
    >
      <Box
        width={'100%'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Button variant={'outlined'} href={'/map-list'} disabled>
          Map
        </Button>
        <Button variant={'outlined'} href={'/map-strings-list'}>
          Word List
        </Button>
      </Box>

      <Box
        width={'100%'}
        padding={`${PADDING}px 0 ${PADDING}px`}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'space-between'}
        gap={`${PADDING}px`}
      >
        <Box>
          <TitleWithIcon
            onClose={() => {}}
            onBack={() => {}}
            withBackIcon={false}
            withCloseIcon={false}
            label="Filter by Language"
          ></TitleWithIcon>
        </Box>
      </Box>

      {mapList.length > 0 ? (
        <Box width={'100%'} paddingTop={`${PADDING}px`}>
          <IonList>
            {mapList.map((map, idx) => {
              return (
                <IonItem
                  key={idx}
                  lines="none"
                  href={`/map-detail/${map.id}`}
                  disabled={!map.id}
                >
                  <IonLabel>{map.name}</IonLabel>
                  {[
                    eProcessStatus.PARSING_STARTED,
                    eProcessStatus.PARSING_COMPLETED,
                  ].includes(map.status) && (
                    <Button variant={'text'} color={'blue-primary'}>
                      Processing...
                    </Button>
                  )}
                  {map.status === eProcessStatus.FAILED && (
                    <Button variant={'text'} color={'error'}>
                      Error
                    </Button>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
