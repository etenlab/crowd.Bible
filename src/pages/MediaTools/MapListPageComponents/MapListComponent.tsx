import { IonItem, IonLabel, IonList } from '@ionic/react';
import { Box } from '@mui/material';
import { Button, CrowdBibleUI, FiFilter, Typography } from '@eten-lab/ui-kit';
import { useAppContext } from '../../../hooks/useAppContext'; //todo: switch to global routes
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { LanguageDto } from '../../../dtos/language.dto';
import {
  MapDetail,
  eProcessStatus,
  useMapTranslationTools,
} from '../../../hooks/useMapTranslationTools';
const { TitleWithIcon } = CrowdBibleUI;

const PADDING = 15;

export const MapListComponent = () => {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback },
  } = useAppContext();
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [langs, setLangs] = useState<LanguageDto[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [mapList, setMapList] = useState<MapDetail[]>([
    // { fileName: 'text name', status: eProcessStatus.FAILED },
  ]);
  const { fileHandler } = useMapTranslationTools(mapList, setMapList);

  useEffect(() => {
    const loadLanguages = async () => {
      if (!singletons) return;
      const res = await singletons.graphThirdLayerService.getLanguages();
      setLangs(res);
    };
    loadLanguages();
  }, [singletons]);

  const uploadFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      fileHandler(e, selectedLang);
      setIsUploadFile(false);
    },
    [fileHandler, selectedLang],
  );

  // useEffect(() => {
  //   for (const mapState of mapList) {
  //     if (mapState.status === eProcessStatus.PARSING_COMPLETED) {
  //       const processMapWords = async (
  //         words: string[],
  //         langId: string,
  //         mapId?: string,
  //       ) => {
  //         if (!singletons || !words.length || !langId) return;
  //         let hasNextBatch = true;
  //         let batchNumber = 0;
  //         const batchItemCount = 100;
  //         const createdWords = [];
  //         while (hasNextBatch) {
  //           const startIdx = batchNumber * batchItemCount;
  //           const endIdx = startIdx + batchItemCount;
  //           const batchWords = words.slice(startIdx, endIdx);
  //           console.log(
  //             'hasNextBatch',
  //             hasNextBatch,
  //             startIdx,
  //             endIdx,
  //             batchWords,
  //           );
  //           createdWords.push(
  //             ...(await singletons.graphThirdLayerService.createWords(
  //               batchWords.map((w) => w.trim()).filter((w) => w !== ''),
  //               langId,
  //               mapId,
  //             )),
  //           );
  //           if (batchWords.length !== batchItemCount) {
  //             hasNextBatch = false;
  //           }
  //           batchNumber++;
  //         }
  //         console.log('total created words', createdWords);
  //       };
  //       const handleMapParsingCompleted = async (argMap: MapDetail) => {
  //         if (!singletons) return;
  //         const newState: Partial<MapDetail> = {
  //           status: eProcessStatus.COMPLETED,
  //         };
  //         try {
  //           //!!!i'll look at map saving here
  //           const mapId = await singletons.graphThirdLayerService.saveMap(
  //             argMap.langId!,
  //             {
  //               name: argMap.name!,
  //               map: argMap.map!,
  //               ext: 'svg',
  //             },
  //           );
  //           if (mapId) {
  //             newState.id = mapId;
  //             processMapWords(argMap.words!, argMap.langId!, mapId);
  //           } else newState.status = eProcessStatus.FAILED;
  //         } catch (error) {
  //           newState.status = eProcessStatus.FAILED;
  //         }
  //         setMapStatus(argMap.tempId!, newState);
  //       };
  //       handleMapParsingCompleted(mapState);
  //     }
  //   }
  // }, [mapList, singletons]);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      alignItems={'start'}
      paddingTop={`${PADDING}px`}
    >
      {!isUploadFile && (
        <>
          <Button
            variant={'contained'}
            component="label"
            fullWidth
            onClick={() => setIsUploadFile(true)}
          >
            Upload .svg file
          </Button>
          {mapList.length > 0 ? (
            <>
              <Box
                paddingTop={`${PADDING}px`}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                width={'100%'}
              >
                <Typography variant="overline">Uploaded maps</Typography>
                <Button onClick={() => alert('filter click!')}>
                  <FiFilter size={25} />
                </Button>
              </Box>
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
            </>
          ) : (
            <></>
          )}
        </>
      )}

      {isUploadFile && (
        <>
          <Button variant={'contained'} component="label" fullWidth>
            Upload {selectedLang} File
            <input
              hidden
              multiple
              accept="image/svg+xml"
              onChange={uploadFile}
              type="file"
            />
          </Button>
        </>
      )}
    </Box>
  );
};
