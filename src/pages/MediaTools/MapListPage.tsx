import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  useIonAlert,
} from '@ionic/react';
import { useCallback, useState } from 'react';
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
import { useAppContext } from '@/hooks/useAppContext';
import { nanoid } from 'nanoid';

type Item = {
  label: string;
  value: unknown;
};

const { TitleWithIcon, ButtonList } = CrowdBibleUI;

const PADDING = 15;

const MOCK_LANGUAGE_OPTIONS = ['Language1', 'Language2'];
const MOCK_TRANSLATED_MAPS: Item[] = [
  { value: 1, label: 'Translated map1 based on language filter' },
  { value: 2, label: 'Translated map2 based on language filter' },
  { value: 3, label: 'Translated map3 based on language filter' },
];

export const MapListPage = () => {
  const [originalSvg, setOriginalSvg] = useState(null as null | string);
  const [textContents, setTextContents] = useState<string[]>([]);
  const [translatedMapsList, setTranslatedMapsList] = useState<Item[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [presentAlert] = useIonAlert();

  const {
    states: {
      global: { translatedMap },
    },
    actions: { setTranslatedMap },
  } = useAppContext();

  const fileHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const f = e.target.files?.[0];

      if (f == null) return;

      const r = new FileReader();

      r.onload = function (evt: ProgressEvent<FileReader>) {
        if (evt.target?.readyState !== 2) return;
        if (evt.target.error != null) {
          showAlert('Error while reading file. Read console for more info');
          console.error(evt.target.error);
          return;
        }

        const filecontent = evt.target.result;

        if (!filecontent) {
          showAlert('Error while reading file. Read console for more info');
          console.error('filecontent is null after reading');
          return;
        }

        const originalSvg = filecontent.toString();

        const parsed = parseSync(originalSvg);
        const textArray = [] as string[];

        iterateOverINode(parsed, ['style'], (node) => {
          if (node.type === 'text' || node.type === 'textPath') {
            if (!node.value) return;
            textArray.push(node.value);
          }
        });

        setTextContents(textArray);
        setOriginalSvg(originalSvg);
        if (textArray.length === 0 && originalSvg) {
          showAlert('No text or textPath tags found');
        } else {
          setTranslatedMapsList((prevList) => {
            return [
              ...prevList,
              { value: nanoid(4), label: f.name?.split('.')[0] },
            ];
          });
        }
      };

      r.readAsText(f);
    },
    [],
  );

  const showAlert = (msg: string) => {
    presentAlert({
      header: 'Alert',
      subHeader: 'Important Message!',
      message: msg,
      buttons: ['Ok'],
    });
  };

  const handleApplyLanguageFilter = (value: string) => {
    setSelectedLanguage(value);
    setTranslatedMapsList([...MOCK_TRANSLATED_MAPS]);
  };

  const handleClearLanguageFilter = () => {
    setSelectedLanguage('');
    setTranslatedMapsList([]);
  };

  console.log('translatedMapsList', translatedMapsList);

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
              onClose={() => {
                //
              }}
              onBack={() => {
                //
              }}
              withBackIcon={false}
              withCloseIcon={false}
              label="Filter by Language"
            ></TitleWithIcon>
          </Box>
          <Box>
            <Autocomplete
              fullWidth
              options={MOCK_LANGUAGE_OPTIONS}
              value={selectedLanguage}
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
              onClose={() => {
                //
              }}
              onBack={() => {
                //
              }}
              withBackIcon={false}
              withCloseIcon={false}
              label="Language ID"
            ></TitleWithIcon>
          </Box>
          <Box flex={1}>
            <Input fullWidth label=""></Input>
          </Box>
        </Box>

        {selectedLanguage ? (
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
              onChange={fileHandler}
              type="file"
            />
          </Button>
        </Box>

        {translatedMapsList.length > 0 ? (
          <Box width={'100%'} paddingTop={`${PADDING}px`}>
            <IonList>
              {translatedMapsList.map((map, idx) => {
                return (
                  <IonItem key={idx} lines="none">
                    <IonLabel>{map.label}</IonLabel>
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

function getWindowWidth() {
  const { innerWidth, innerHeight } = window;
  return innerWidth;
}
