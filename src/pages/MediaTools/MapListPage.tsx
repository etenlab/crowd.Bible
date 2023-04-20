import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  useIonAlert,
} from '@ionic/react';
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { type INode, parseSync } from 'svgson';
import {
  Autocomplete,
  Input,
  CrowdBibleUI,
  BiTrashAlt,
  MuiMaterial,
  Button,
} from '@eten-lab/ui-kit';
import { nanoid } from 'nanoid';
import { useSingletons } from '@/src/hooks/useSingletons';
import { LanguageDto } from '@/src/dtos/language.dto';
const { TitleWithIcon } = CrowdBibleUI;
const { Box, Typography, styled, CircularProgress } = MuiMaterial;

//#region types
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
  map?: string;
  name?: string;
  langId?: string;
};
//#endregion

//#region data
const PADDING = 15;
//#endregion

export const MapListPage = () => {
  const langIdRef = useRef('');
  const [langs, setLangs] = useState<LanguageDto[]>([]);
  const [mapList, setMapList] = useState<MapDetail[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [presentAlert] = useIonAlert();
  const [uploadMapBtnStatus, setUploadMapBtnStatus] =
    useState<eUploadMapBtnStatus>(eUploadMapBtnStatus.NONE);
  const singletons = useSingletons();

  useEffect(() => {
    const loadLanguages = async () => {
      if (!singletons) return;
      const res = await singletons.graphThirdLayerService.getLanguages();
      setLangs(res);
      // if (res.length > 0) setSelectedLang(res.at(0)!.name);
    };
    loadLanguages();
  }, [singletons]);

  useEffect(() => {
    for (const mapState of mapList) {
      if (mapState.status === eProcessStatus.PARSING_COMPLETED) {
        const processMapWords = async (
          words: string[],
          langId: string,
          mapId?: string,
        ) => {
          if (!singletons || !words.length || !langId) return;
          let hasNextBatch = true;
          let batchNumber = 0;
          const batchItemCount = 100;
          const createdWords = [];
          while (hasNextBatch) {
            const startIdx = batchNumber * batchItemCount;
            const endIdx = startIdx + batchItemCount;
            const batchWords = words.slice(startIdx, endIdx);
            console.log(
              'hasNextBatch',
              hasNextBatch,
              startIdx,
              endIdx,
              batchWords,
            );
            createdWords.push(
              ...(await singletons.graphThirdLayerService.createWords(
                batchWords.map((w) => w.trim()).filter((w) => w !== ''),
                langId,
                mapId,
              )),
            );
            if (batchWords.length !== batchItemCount) {
              hasNextBatch = false;
            }
            batchNumber++;
          }
          console.log('total created words', createdWords);
        };
        const handleMapParsingCompleted = async (argMap: MapDetail) => {
          if (!singletons) return;
          const newState: Partial<MapDetail> = {
            status: eProcessStatus.COMPLETED,
          };
          try {
            const mapId = await singletons.graphThirdLayerService.saveMap(
              argMap.langId!,
              {
                name: argMap.name!,
                map: argMap.map!,
                ext: 'svg',
              },
            );
            if (mapId) {
              newState.id = mapId;
              processMapWords(argMap.words!, argMap.langId!, mapId);
            } else newState.status = eProcessStatus.FAILED;
          } catch (error) {
            newState.status = eProcessStatus.FAILED;
          }
          setMapStatus(argMap.tempId!, newState);
        };
        handleMapParsingCompleted(mapState);
      }
    }
  }, [mapList, singletons]);

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
      const id = nanoid();
      setMapList((prevList) => {
        return [
          ...prevList,
          {
            tempId: id,
            name: file.name?.split('.')[0],
            status: eProcessStatus.PARSING_STARTED,
            langId: langIdRef.current,
          },
        ];
      });
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
          const base64Svg = Buffer.from(originalSvg, 'utf8').toString('base64');
          setMapStatus(id, {
            status: eProcessStatus.PARSING_COMPLETED,
            map: base64Svg,
            words: textArray,
          });
        }
      };
      fileReader.readAsText(file);
      e.target.value = '';
    },
    [showAlert],
  );

  const setMapsByLang = async (langId: string) => {
    if (!singletons) return;
    const res = await singletons.graphThirdLayerService.getMaps(langId);
    setMapList(
      res.map(
        (m) =>
          ({
            id: m.id,
            name: m.name,
            map: m.map,
            status: eProcessStatus.NONE,
            words: [],
          } as MapDetail),
      ),
    );
  };

  const handleUploadBtnClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ): void => {
    if (uploadMapBtnStatus === eUploadMapBtnStatus.NONE) {
      setUploadMapBtnStatus(eUploadMapBtnStatus.LANG_SELECTION);
    } else if (uploadMapBtnStatus === eUploadMapBtnStatus.LANG_SELECTION) {
      if (selectedLang) {
        setUploadMapBtnStatus(eUploadMapBtnStatus.UPLOAD_FILE);
      } else {
        e.stopPropagation();
        e.preventDefault();
      }
    } else if (uploadMapBtnStatus === eUploadMapBtnStatus.SAVING_FILE) {
    }
  };

  const handleApplyLanguageFilter = (value: string) => {
    setSelectedLang(value);
    const curLangDetail = langs.find((l) => l.name === value);
    if (curLangDetail) {
      langIdRef.current = curLangDetail.id;
      setMapsByLang(curLangDetail.id);
    }
  };

  const handleClearLanguageFilter = () => {
    setSelectedLang('');
    setMapList([]);
  };

  const langLabels = langs.map((l) => l.name);
  return (
    <IonContent>
      <Box
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        padding={'20px'}
        bgcolor={'text.light-blue'}
      >
        <Typography
          color={'text.dark'}
          sx={{ fontSize: '20px', lineHeight: '28px', fontWeight: 600 }}
        >
          Map Translator
        </Typography>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        alignItems={'start'}
        padding={'20px'}
        paddingTop={'15px'}
      >
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'20px'}
        >
          <StyledButtonTab variant={'contained'} href={'/map-list'}>
            Map
          </StyledButtonTab>
          <StyledButtonTab variant={'text'} href={'/map-strings-list'}>
            Word List
          </StyledButtonTab>
        </Box>

        {uploadMapBtnStatus > eUploadMapBtnStatus.NONE ? (
          <>
            <StyledSectionTypography>
              Select the source language
            </StyledSectionTypography>
            <Box
              display={'flex'}
              width={'100%'}
              gap={'20px'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Autocomplete
                options={langLabels}
                value={selectedLang}
                onChange={(_, value) => {
                  handleApplyLanguageFilter(value || '');
                }}
                label=""
                sx={{
                  flex: 1,
                  borderColor: 'text.gray',
                  color: 'text.dark',
                  fontWeight: 700,
                }}
              />
              <Input label="" placeholder="Language ID" sx={{ flex: 1 }} />
            </Box>
          </>
        ) : (
          <></>
        )}

        <Button
          fullWidth
          onClick={handleUploadBtnClick}
          variant={'contained'}
          component="label"
          sx={{
            backgroundColor: 'text.blue-primary',
            color: 'text.white',
            fontSize: '14px',
            fontWeight: 800,
            padding: '14px 73px',
            marginTop: '20px',
            ':hover': {
              backgroundColor: 'text.blue-primary',
            },
          }}
        >
          Upload {selectedLang || '.svg'} File
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

        <StyledBox>
          <StyledSectionTypography>
            Select the source language
          </StyledSectionTypography>
        </StyledBox>

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
    </IonContent>
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

//#region styled component
const StyledButtonTab = styled(Button)(({ theme, variant }) => {
  const conditionalStyles = {};
  if (variant === 'text') {
    Object.assign(conditionalStyles, {
      color: theme.palette.text.gray,
      borderBottom: '1px solid',
      borderColor: theme.palette.text['middle-gray'],
    });
  } else {
    Object.assign(conditionalStyles, {
      color: theme.palette.text['blue-primary'],
      backgroundColor: '#CBE0F8',
      ':hover': {
        backgroundColor: '#CBE0F8',
      },
    });
  }
  return {
    fontWeight: 800,
    fontSize: '14px',
    lineHeight: '20px',
    borderRadius: '4px',
    padding: '11px 46px',
    gap: '10px',
    height: '42px',
    flex: 1,

    ...conditionalStyles,
  };
});
const StyledSectionTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.gray,
  fontWeight: 800,
  fontSize: '14px',
  lineHeight: '20px',
  textTransform: 'uppercase',
  padding: '15px 0px',
  letterSpacing: '0.05em',
  paddingTop: '20px',
}));
const StyledBox = styled(Box)(({}) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px 0px',
}));
//#endregion
