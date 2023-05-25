import { IonItem, IonLabel, IonList, useIonAlert } from '@ionic/react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { type INode, parseSync } from 'svgson';
import {
  MuiMaterial,
  Button,
  LanguageInfo,
  LangSelector,
} from '@eten-lab/ui-kit';
import { nanoid } from 'nanoid';
import {
  StyledFilterButton,
  StyledSectionTypography,
} from './StyledComponents';
import { useAppContext } from '../../hooks/useAppContext';
import { useMapTranslationTools } from '../../hooks/useMapTranslationTools';
import { langInfo2String } from '../../utils/langUtils';
const { Box, styled, CircularProgress } = MuiMaterial;

const PADDING = 20;

enum eProcessStatus {
  NONE = 'NONE',
  PARSING_STARTED = 'PARSING_STARTED',
  PARSING_COMPLETED = 'PARSING_COMPLETED',
  COMPLETED = 'SAVED_IN_DB',
  FAILED = 'FAILED',
}
enum eUploadMapBtnStatus {
  NONE,
  LANG_SELECTION,
  UPLOAD_FILE,
  SAVING_FILE,
  COMPLETED,
}
type MapDetail = {
  id?: string;
  tempId?: string;
  status: eProcessStatus;
  words?: string[];
  mapFileId?: string;
  name?: string;
  langInfo: LanguageInfo;
};

export const MapTabContent = () => {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback },
    logger,
  } = useAppContext();

  const [mapList, setMapList] = useState<MapDetail[]>([]);
  const [langInfo, setLangInfo] = useState<LanguageInfo | undefined>();
  const [presentAlert] = useIonAlert();
  const [uploadMapBtnStatus, setUploadMapBtnStatus] =
    useState<eUploadMapBtnStatus>(eUploadMapBtnStatus.NONE);
  const { sendMapFile } = useMapTranslationTools();

  useEffect(() => {
    for (const mapState of mapList) {
      if (mapState.status === eProcessStatus.PARSING_COMPLETED) {
        const processMapWords = async (
          words: string[],
          langInfo: LanguageInfo,
          mapId: string,
        ) => {
          if (!singletons || !words.length || !langInfo) return;
          let hasNextBatch = true;
          let batchNumber = 0;
          const batchItemCount = 100;
          const createdWords = [];
          while (hasNextBatch) {
            const startIdx = batchNumber * batchItemCount;
            const endIdx = startIdx + batchItemCount;
            const batchWords = words.slice(startIdx, endIdx);
            logger.info(
              'hasNextBatch',
              hasNextBatch,
              startIdx,
              endIdx,
              batchWords,
            );
            createdWords.push(
              ...(await singletons.wordService.createWordsWithLangForMap(
                batchWords.map((w) => w.trim()).filter((w) => w !== ''),
                langInfo,
                mapId,
              )),
            );
            if (batchWords.length !== batchItemCount) {
              hasNextBatch = false;
            }
            batchNumber++;
          }
          logger.info('total created words', createdWords);
        };
        const handleMapParsingCompleted = async (argMap: MapDetail) => {
          if (!singletons) return;
          const newState: Partial<MapDetail> = {
            status: eProcessStatus.COMPLETED,
          };
          try {
            const mapId = await singletons.mapService.saveMap(argMap.langInfo, {
              name: argMap.name!,
              mapFileId: argMap.mapFileId!,
              ext: 'svg',
            });
            if (mapId) {
              newState.id = mapId;
              processMapWords(argMap.words!, argMap.langInfo, mapId);
            } else newState.status = eProcessStatus.FAILED;
          } catch (error) {
            newState.status = eProcessStatus.FAILED;
          }
          setMapStatus(argMap.tempId!, newState);
        };
        handleMapParsingCompleted(mapState);
      }
    }
  }, [logger, mapList, singletons]);

  const showAlert = useCallback(
    (msg: string) => {
      presentAlert({
        header: 'Alert',
        subHeader: 'Important Message!',
        message: msg,
        buttons: ['Ok'],
      });
    },
    [presentAlert],
  );

  const setMapStatus = (tempId: string, state: Partial<MapDetail>) => {
    setMapList((prevList) => {
      const clonedList = [...prevList];
      const idx = clonedList.findIndex((m) => m.tempId === tempId);
      if (idx > -1) {
        clonedList[idx] = { ...clonedList[idx], ...state };
      }
      return clonedList;
    });
  };

  const fileHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file == null) return;
      if (!langInfo) return;
      const fileName = file.name?.split('.')[0];
      const id = nanoid();
      let alreadyExists = false;

      setMapList((prevList) => {
        const existingIdx = prevList.findIndex((map) => map.name === fileName);
        if (existingIdx >= 0) {
          alertFeedback('error', 'File already exists');
          alreadyExists = true;
          return [...prevList];
        }
        return [
          ...prevList,
          {
            tempId: id,
            name: fileName,
            status: eProcessStatus.PARSING_STARTED,
            langInfo,
          },
        ];
      });
      if (alreadyExists) return;
      const fileReader = new FileReader();
      fileReader.onload = function (evt: ProgressEvent<FileReader>) {
        if (evt.target?.readyState !== 2) return;
        if (evt.target.error != null) {
          setMapStatus(id, { status: eProcessStatus.FAILED });
          showAlert('Error while reading file. Read console for more info');
          return;
        }
        const filecontent = evt.target.result;
        if (!filecontent) {
          setMapStatus(id, { status: eProcessStatus.FAILED });
          showAlert('Error while reading file. Read console for more info');
          return;
        }
        const originalSvg = filecontent.toString();
        const parsed = parseSync(originalSvg);
        const textArray: string[] = [];
        iterateOverINode(parsed, ['style'], (node) => {
          if (node.type === 'text' || node.type === 'textPath') {
            if (!node.value) return;
            textArray.push(node.value);
          }
        });

        if (textArray.length === 0 && originalSvg) {
          setMapStatus(id, { status: eProcessStatus.FAILED });
          showAlert('No text or textPath tags found');
        } else {
          sendMapFile(file, (sentFileData) => {
            setMapStatus(id, {
              status: eProcessStatus.PARSING_COMPLETED,
              mapFileId: sentFileData.id,
              words: textArray,
            });
          });
        }
      };
      fileReader.readAsText(file);
      e.target.value = '';
    },
    [alertFeedback, langInfo, sendMapFile, showAlert],
  );

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
              map: m.map,
              status: eProcessStatus.NONE,
              words: [],
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
        e.stopPropagation();
        e.preventDefault();
      }
    } else if (uploadMapBtnStatus === eUploadMapBtnStatus.SAVING_FILE) {
    }
  };

  const handleLangChange = useCallback(
    (_langTag: string, langInfo: LanguageInfo) => {
      setLangInfo(langInfo);
      setMapsByLang(langInfo);
    },
    [setMapsByLang],
  );

  const handleClearLanguageFilter = () => {
    setLangInfo(undefined);
    setMapList([]);
    setUploadMapBtnStatus(eUploadMapBtnStatus.LANG_SELECTION);
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      alignItems={'start'}
      width={'100%'}
      paddingTop={`${PADDING}px`}
    >
      {uploadMapBtnStatus > eUploadMapBtnStatus.NONE ? (
        <>
          <StyledSectionTypography>
            Select the source language
          </StyledSectionTypography>
          <LangSelector onChange={handleLangChange} selected={langInfo} />
        </>
      ) : (
        <></>
      )}

      <Button
        fullWidth
        onClick={handleUploadBtnClick}
        variant={'contained'}
        component="label"
      >
        Upload {langInfo2String(langInfo) || '.svg'} File
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
      {langInfo && mapList.length ? (
        <>
          <StyledBox>
            <StyledSectionTypography>Uploaded Maps</StyledSectionTypography>
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
    </Box>
  );
};

/**
 * Should iterate over INode and its children in a consistent order
 * @param node starting node
 * @param skipNodeNames node names to exclude with all its children
 * @param cb callback to be applied
 * @returns
 */
function iterateOverINode(
  node: INode,
  skipNodeNames: string[],
  cb: (node: INode) => void,
) {
  if (skipNodeNames.includes(node.name)) return;

  cb(node);

  for (const child of node.children || []) {
    iterateOverINode(child, skipNodeNames, cb);
  }
}

const StyledBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px 0px',
}));
