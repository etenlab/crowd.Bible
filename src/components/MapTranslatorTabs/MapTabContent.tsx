import { IonItem, IonLabel, IonList } from '@ionic/react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import {
  MuiMaterial,
  Button,
  LanguageInfo,
  LangSelector,
} from '@eten-lab/ui-kit';
import {
  StyledFilterButton,
  StyledSectionTypography,
} from './StyledComponents';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import {
  MapDetail,
  eProcessStatus,
  useMapTranslationTools,
} from '@/hooks/useMapTranslationTools';
import { langInfo2String } from '@/utils/langUtils';
import { FeedbackTypes } from '@/constants/common.constant';
import { PropertyKeyConst } from '@eten-lab/core';

const { Box, styled, CircularProgress } = MuiMaterial;

const PADDING = 20;

enum eUploadMapBtnStatus {
  NONE,
  LANG_SELECTION,
  UPLOAD_FILE,
  SAVING_FILE,
  COMPLETED,
}

export const MapTabContent = () => {
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage: langInfo },
    },
    actions: { alertFeedback, setSourceLanguage: setLangInfo },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [mapList, setMapList] = useState<MapDetail[]>([]);
  const [uploadMapBtnStatus, setUploadMapBtnStatus] =
    useState<eUploadMapBtnStatus>(eUploadMapBtnStatus.NONE);
  const { processFile, setMapStatus } = useMapTranslationTools();

  // for now we show all maps despite selected language
  useEffect(() => {
    if (!singletons) {
      logger.error({ at: 'useEffect loading all maps' }, 'No singletons!');
      return;
    }
    (async function loadAllProcessedMaps() {
      const res = await singletons.mapService.getMaps();
      setMapList(
        res
          .filter((m) => m[PropertyKeyConst.IS_PROCESSING_FINISHED])
          .map(
            (m) =>
              ({
                id: m.id,
                name: m[PropertyKeyConst.NAME],
                status: eProcessStatus.NONE,
                langInfo: m.langInfo,
              } as MapDetail),
          ),
      );
    })();
  }, [logger, singletons]);

  useEffect(() => {
    if (!singletons) {
      logger.error({ at: 'useEffect storing words' }, 'No singletons!');
      return;
    }
    for (const mapState of mapList) {
      if (mapState.status !== eProcessStatus.PARSING_COMPLETED) continue;

      const handleMapParsingCompleted = async (argMap: MapDetail) => {
        const newState: Partial<MapDetail> = {
          status: eProcessStatus.COMPLETED,
        };
        try {
          const mapId = await singletons.mapService.saveMap(argMap.langInfo, {
            [PropertyKeyConst.NAME]: argMap.name!,
            [PropertyKeyConst.MAP_FILE_ID]: argMap.mapFileId!,
            [PropertyKeyConst.EXT]: 'svg',
          });
          if (mapId) {
            newState.id = mapId;
            await singletons.mapService.processMapWords(
              argMap.words!,
              argMap.langInfo,
              mapId,
            );

            // check in case if such a map was started uploading, and re-sarted from new window.
            const isExists = await singletons.mapService.doesExistMapWithProps([
              {
                key: PropertyKeyConst.NAME,
                value: argMap.name,
              },
              {
                key: PropertyKeyConst.IS_PROCESSING_FINISHED,
                value: true,
              },
            ]);
            if (!isExists) {
              await singletons.graphSecondLayerService.addNewNodePropertiesNoChecks(
                mapId,
                {
                  [PropertyKeyConst.IS_PROCESSING_FINISHED]: true,
                },
              );
              alertFeedback(
                FeedbackTypes.SUCCESS,
                `Map file (name:${argMap.name}) is uploaded.`,
              );
            } else {
              alertFeedback(
                FeedbackTypes.ERROR,
                `Map file (name:${argMap.name}) already exists.`,
              );
            }
          } else newState.status = eProcessStatus.FAILED;
        } catch (error) {
          newState.status = eProcessStatus.FAILED;
        }
        setMapStatus(argMap.tempId!, newState, setMapList);
      };
      handleMapParsingCompleted(mapState);
    }
  }, [alertFeedback, logger, mapList, setMapStatus, singletons]);

  const fileHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        alertFeedback(FeedbackTypes.ERROR, 'No file selected');
        return;
      }
      if (!langInfo) {
        alertFeedback(FeedbackTypes.ERROR, 'No language seleced');
        return;
      }
      window.addEventListener('beforeunload', () => {
        'alert';
      });
      processFile(file, langInfo, setMapList);
      e.target.value = '';
    },
    [alertFeedback, langInfo, processFile],
  );

  // for now we show all maps despite selected language
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setMapsByLang = useCallback(
    async (langInfo: LanguageInfo) => {
      if (!singletons) return;
      const res = await singletons.mapService.getMaps(langInfo);
      setMapList(
        res.map(
          (m) =>
            ({
              id: m.id,
              name: m.name,
              status: eProcessStatus.NONE,
              langInfo: m.langInfo,
            } as MapDetail),
        ),
      );
    },
    [singletons],
  );

  const handleUploadBtnClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ): void => {
    if (uploadMapBtnStatus === eUploadMapBtnStatus.NONE) {
      setUploadMapBtnStatus(eUploadMapBtnStatus.LANG_SELECTION);
    } else if (uploadMapBtnStatus === eUploadMapBtnStatus.LANG_SELECTION) {
      if (langInfo) {
        setUploadMapBtnStatus(eUploadMapBtnStatus.UPLOAD_FILE);
      } else {
        alertFeedback(FeedbackTypes.INFO, 'Please select language first.');
        e.stopPropagation();
        e.preventDefault();
      }
    } else if (uploadMapBtnStatus === eUploadMapBtnStatus.SAVING_FILE) {
    }
  };

  const handleLangChange = useCallback(
    (_langTag: string, langInfo: LanguageInfo) => {
      setLangInfo(langInfo);
      // setMapsByLang(langInfo); // for now we show all maps despite selected language
    },
    [setLangInfo],
  );

  const handleClearLanguageFilter = useCallback(() => {
    setLangInfo(null);
    // setMapList([]); // for now we show all maps despite selected language
    setUploadMapBtnStatus(eUploadMapBtnStatus.LANG_SELECTION);
  }, [setLangInfo]);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      alignItems={'start'}
      width={'100%'}
      paddingTop={`${PADDING}px`}
    >
      <LangSelector
        label={tr('Select the source language')}
        onChange={handleLangChange}
        selected={langInfo || undefined}
      />

      <Button
        fullWidth
        onClick={handleUploadBtnClick}
        variant={'contained'}
        component="label"
      >
        Upload {langInfo2String(langInfo || undefined) || '.svg'} File
        {uploadMapBtnStatus === eUploadMapBtnStatus.SAVING_FILE ? (
          <>
            <CircularProgress
              disableShrink
              sx={{
                color: 'text.white',
                fontWeight: 800,
                marginLeft: '10px',
              }}
              size={24}
            />
          </>
        ) : (
          <></>
        )}
        <input
          hidden
          multiple={false}
          accept="image/svg+xml"
          onChange={fileHandler}
          type="file"
        />
      </Button>

      {/* Uploaded Maps */}
      {mapList.length ? (
        <>
          <StyledBox>
            <StyledSectionTypography>
              {tr('Uploaded Maps')}
            </StyledSectionTypography>
            <StyledFilterButton
              onClick={handleClearLanguageFilter}
            ></StyledFilterButton>
          </StyledBox>
          <Box width={'100%'} marginTop={'-25px'}>
            <IonList>
              {mapList.map((map, idx) => {
                return (
                  <IonItem
                    key={idx}
                    href={`/map-detail/${map.id}`}
                    disabled={!map.id}
                  >
                    <IonLabel
                      style={{
                        color: '#1B1B1B',
                        fontSize: '16px',
                        lineHeight: '26px',
                        fontWeight: 400,
                        padding: '12px 0px',
                      }}
                    >
                      {map.name}
                    </IonLabel>
                    <IonLabel
                      style={{
                        color: '#616F82',
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontWeight: 500,
                        padding: '12px 0px',
                      }}
                    >
                      {langInfo2String(map.langInfo)}
                    </IonLabel>
                    {[
                      eProcessStatus.PARSING_STARTED,
                      eProcessStatus.PARSING_COMPLETED,
                    ].includes(map.status) && (
                      <Button variant={'text'} color={'blue-primary'}>
                        {tr('Processing... Don`t close this page')}
                      </Button>
                    )}
                    {map.status === eProcessStatus.FAILED && (
                      <Button variant={'text'} color={'error'}>
                        {tr('Error')}
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
    </Box>
  );
};

const StyledBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px 0px',
}));
