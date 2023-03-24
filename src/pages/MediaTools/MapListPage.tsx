import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  useIonAlert,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type INode, parseSync } from 'svgson';
import { Box, Typography } from '@mui/material';
import {
  Alert,
  Autocomplete,
  Button,
  Input,
  CrowdBibleUI,
  BiTrashAlt,
} from '@eten-lab/ui-kit';
import { nanoid } from 'nanoid';
import useNodeServices from '@/src/hooks/useNodeServices';
import { LanguageDto } from '@/src/dtos/lang.dto';
const { TitleWithIcon } = CrowdBibleUI;

//#region types
enum eProcessStatus {
  NONE = 'NONE',
  PARSING_STARTED = 'PARSING_STARTED',
  PARSING_COMPLETED = 'PARSING_COMPLETED',
  COMPLETED = 'SAVED_IN_DB',
  FAILED = 'FAILED',
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
  const [mapList, setMapList] = useState<MapDetail[]>([
    // { fileName: 'text name', status: eProcessStatus.FAILED },
  ]);
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [presentAlert] = useIonAlert();
  const { nodeService } = useNodeServices();

  useEffect(() => {
    loadLanguages();
  }, [nodeService]);

  useEffect(() => {
    for (const mapState of mapList) {
      if (mapState.status === eProcessStatus.PARSING_COMPLETED) {
        handleMapParsingCompleted(mapState);
      }
    }
  }, [mapList]);

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

  const handleMapParsingCompleted = async (argMap: MapDetail) => {
    if (!nodeService) return;
    let isSuccess = true;
    try {
      const mapSaveRes = await nodeService.saveMap(argMap.langId!, {
        name: argMap.name!,
        map: argMap.map!,
        ext: 'svg',
      });
      console.log('map successfully saved:', mapSaveRes);
      if (mapSaveRes) processMapWords(argMap.words!, argMap.langId!);
      else isSuccess = false;
    } catch (error) {
      isSuccess = false;
    }
    setMapStatus(argMap.tempId!, {
      status: isSuccess ? eProcessStatus.COMPLETED : eProcessStatus.FAILED,
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
          setMapStatus(id, {
            status: eProcessStatus.PARSING_COMPLETED,
            map: originalSvg,
            words: textArray,
          });
        }
      };
      fileReader.readAsText(file);
      e.target.value = '';
    },
    [],
  );

  const fileUploadPreCheck = (e: Event) => {
    let msg = '';
    if (!selectedLang) {
      msg = 'Please choose the language first and then Add Map';
    }
    if (msg) {
      showAlert(msg);
      e?.preventDefault();
      e?.stopPropagation();
    }
  };

  const loadLanguages = async () => {
    if (!nodeService) return;
    const res = await nodeService.getLanguages();
    setLangs(res);
  };

  const setMapsByLang = async (langId: string) => {
    if (!nodeService) return;
    const res = await nodeService.getMaps(langId);
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

  const processMapWords = async (words: string[], langId: string) => {
    if (!nodeService || !words.length || !langId) return;
    const wordsQueue = [];
    for (const word of words) {
      wordsQueue.push(nodeService.createWord(word, langId));
    }
    const resList = await Promise.allSettled(wordsQueue);
    const createdWords = resList.filter((res) => res.status === 'fulfilled');
    console.log('created words::', createdWords);
  };

  const showAlert = (msg: string) => {
    presentAlert({
      header: 'Alert',
      subHeader: 'Important Message!',
      message: msg,
      buttons: ['Ok'],
    });
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
          <Button variant={'text'} href={'/map-list'} disabled>
            Map List
          </Button>
          <Button variant={'text'} href={'/map-strings-list'}>
            String List
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
          <Box>
            <Autocomplete
              fullWidth
              options={langLabels}
              value={selectedLang}
              onChange={(_, value) => {
                handleApplyLanguageFilter(value || '');
              }}
              label="Languages"
            ></Autocomplete>
          </Box>
        </Box>

        <Box
          width={'100%'}
          padding={`${PADDING}px 0 ${PADDING}px`}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          gap={`${PADDING}px`}
        >
          <Box flex={1} alignSelf={'center'}>
            <TitleWithIcon
              onClose={() => {}}
              onBack={() => {}}
              withBackIcon={false}
              withCloseIcon={false}
              label="Language ID"
            ></TitleWithIcon>
          </Box>
          <Box flex={1}>
            <Input fullWidth label=""></Input>
          </Box>
        </Box>

        {selectedLang ? (
          <Box
            width={'100%'}
            padding={`${PADDING}px 0 ${PADDING}px`}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'flex-end'}
            gap={`${PADDING}px`}
          >
            <Button
              variant="contained"
              endIcon={<BiTrashAlt />}
              color={'error'}
              size="small"
              onClick={() => {
                handleClearLanguageFilter();
              }}
            >
              Clear language filter
            </Button>
          </Box>
        ) : (
          <></>
        )}

        <Box
          width={'100%'}
          padding={`${PADDING}px 0 ${PADDING}px`}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          gap={`${PADDING}px`}
        >
          <Typography fontWeight={700}>Map List</Typography>
          <Button variant={'contained'} component="label">
            Add Map
            <input
              hidden
              multiple
              accept="image/svg+xml"
              onClick={fileUploadPreCheck as any}
              onChange={fileHandler}
              type="file"
            />
          </Button>
        </Box>

        {mapList.length > 0 ? (
          <Box width={'100%'} paddingTop={`${PADDING}px`}>
            <IonList>
              {mapList.map((map, idx) => {
                return (
                  <IonItem key={idx} lines="none" href="/map-detail">
                    <IonLabel>{map.name}</IonLabel>
                    {[
                      eProcessStatus.PARSING_STARTED,
                      eProcessStatus.PARSING_COMPLETED,
                    ].includes(map.status) && <IonSpinner></IonSpinner>}
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
