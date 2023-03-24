import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  useIonAlert,
} from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
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
const { TitleWithIcon } = CrowdBibleUI;

//#region types
enum eProcessStatus {
  NONE = 'NONE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
type MapDetail = {
  id?: string;
  tempId?: string;
  status: eProcessStatus;
  words?: string[];
  fileStream?: string;
  fileName?: string;
};

type Option = {
  id: string;
  lable: string;
};
//#endregion

//#region data
const PADDING = 15;
//#endregion

export const MapListPage = () => {
  const [langs, setLangs] = useState<Option[]>([]);
  const [mapList, setMapList] = useState<MapDetail[]>([
    // { fileName: 'text name', status: eProcessStatus.FAILED },
  ]);
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [presentAlert] = useIonAlert();
  const { nodeService } = useNodeServices();

  useEffect(() => {
    loadLanguages();
  }, [nodeService]);

  const setMapStatus = (id: string, partialState: Partial<MapDetail>) => {
    setMapList((prevList) => {
      const clonedList = [...prevList];
      const idx = clonedList.findIndex((m) => m.tempId === id);
      if (idx > -1) {
        clonedList[idx] = { ...clonedList[idx], ...partialState };
      }
      return clonedList;
    });

    if (partialState.status === eProcessStatus.COMPLETED) {
      processMapWords(partialState.words || [], selectedLang);
      nodeService
        ?.saveMap(selectedLang, {
          name: partialState.fileName!,
          map: partialState.fileStream!,
          ext: 'svg',
        })
        .then((res) => {
          console.log('map successfully saved:', res);
        });
    }
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
            fileName: file.name?.split('.')[0],
            status: eProcessStatus.PROCESSING,
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
            status: eProcessStatus.COMPLETED,
            fileStream: originalSvg,
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
    const langNodes = await nodeService.getLanguages();
    const langs: Option[] = [];
    for (const node of langNodes) {
      const strJson = node.propertyKeys.at(0)?.propertyValue?.property_value;
      if (strJson) {
        const valObj = JSON.parse(strJson);
        if (valObj.value) langs.push({ id: node.id, lable: valObj.value });
      }
    }
    setLangs(langs);
  };

  const processMapWords = async (words: string[], language: string) => {
    if (!nodeService || !words.length || !language) return;
    const wordsQueue = [];
    for (const word of words) {
      wordsQueue.push(nodeService.createWord(word, language));
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
  };

  const handleClearLanguageFilter = () => {
    setSelectedLang('');
    setMapList([]);
  };

  const langLabels = langs.map((l) => l.lable);
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
                    <IonLabel>{map.fileName}</IonLabel>
                    {map.status === eProcessStatus.PROCESSING && (
                      <IonSpinner></IonSpinner>
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
