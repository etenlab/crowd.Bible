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
const { Box, Typography, styled } = MuiMaterial;

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
  const singletons = useSingletons();

  useEffect(() => {
    const loadLanguages = async () => {
      if (!singletons) return;
      const res = await singletons.graphThirdLayerService.getLanguages();
      setLangs(res);
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

  const fileUploadPreCheck = (e: MouseEvent<HTMLInputElement>) => {
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
        <Typography
          color={'text.gray'}
          fontWeight={800}
          fontSize={'14px'}
          lineHeight={'20px'}
          sx={{
            textTransform: 'uppercase',
            padding: '15px 0px',
            letterSpacing: '0.05em',
          }}
        >
          Select the source language
        </Typography>
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
            sx={{ flex: 1 }}
          />
          <Input label="" placeholder="Language ID" sx={{ flex: 1 }} />
        </Box>
        <Button
          fullWidth
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
          Upload .svg File
        </Button>

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
              onClick={fileUploadPreCheck}
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
//#endregion
