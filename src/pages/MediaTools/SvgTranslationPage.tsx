import { useCallback, useEffect, useMemo, useState } from 'react';
import { IonContent } from '@ionic/react';

import { type INode, parseSync, stringify } from 'svgson';
import {
  Alert,
  Autocomplete,
  Button,
  Input,
  CrowdBibleUI,
  MuiMaterial,
  BiRightArrowAlt,
  Typography,
} from '@eten-lab/ui-kit';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { DebounceInput } from 'react-debounce-input';
import { useAppContext } from '@/hooks/useAppContext';
import { useHistory } from 'react-router';

const { Box } = MuiMaterial;

type Item = {
  label: string;
  value: string;
};

const { TitleWithIcon, ButtonList } = CrowdBibleUI;

const PADDING = 20;

const MOCK_ETHNOLOGUE_OPTIONS = ['Ethnologue1', 'Ethnologue2'];
const MOCK_TRANSLATED_MAPS: Item[] = [
  { value: '1', label: 'Translated map1' },
  { value: '2', label: 'Translated map2' },
  { value: '3', label: 'Translated map3' },
];

export const SvgTranslationPage = () => {
  const [originalSvg, setOriginalSvg] = useState(null as null | string);
  const [translatedMapsList, setTranslatedMapsList] = useState([] as Item[]);
  const [error, setError] = useState('');
  const [translations, setTranslations] = useState([] as string[]);
  const [textContents, setTextContents] = useState([] as string[]);
  const [parsed, setParsed] = useState<INode | null>(null);
  const history = useHistory();
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const {
    states: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      global: { translatedMap },
    },
    actions: { setTranslatedMap },
  } = useAppContext();

  const translatedSvg: string = useMemo(() => {
    if (parsed == null) return '';
    const trans = [...translations];
    iterateOverINode(parsed, ['style'], (node) => {
      if (node.type === 'text' || node.type === 'textPath') {
        if (!node.value) return;
        node.value = trans.shift() || node.value;
      }
    });
    const str = stringify(parsed);
    return str;
  }, [parsed, translations]);

  const fileHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const f = e.target.files?.[0];

      if (f == null) return;

      const r = new FileReader();

      r.onload = function (evt: ProgressEvent<FileReader>) {
        if (evt.target?.readyState !== 2) return;
        if (evt.target.error != null) {
          setError('Error while reading file. Read console for more info');
          console.error(evt.target.error);
          return;
        }

        const filecontent = evt.target.result;

        if (!filecontent) {
          setError('Error while reading file. Read console for more info');
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
        setParsed(parsed);
        setOriginalSvg(originalSvg);
      };

      r.readAsText(f);
    },
    [],
  );

  const items = useMemo(() => {
    return translatedMapsList.map((item) => ({
      ...item,
      startIcon: <BiRightArrowAlt size={25} />,
    }));
  }, [translatedMapsList]);

  if (textContents.length === 0 && originalSvg) {
    debugger;
    return (
      <Alert
        severity="warning"
        content={undefined}
        rel={undefined}
        rev={undefined}
      >
        No text or textPath tags found
      </Alert>
    );
  }

  return (
    <IonContent>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        alignItems={'start'}
        paddingTop={`${PADDING}px`}
      >
        {originalSvg ? (
          <TitleWithIcon
            onClose={() => {}}
            onBack={() => {
              setTranslatedMap({ translatedMapStr: translatedSvg });
              setOriginalSvg(null);
              setParsed(null);
              setTranslatedMapsList(MOCK_TRANSLATED_MAPS);
            }}
            withBackIcon={true}
            withCloseIcon={false}
            label="Upload .SVG File"
          ></TitleWithIcon>
        ) : (
          <TitleWithIcon
            onClose={() => {}}
            onBack={() => {}}
            withBackIcon={false}
            withCloseIcon={false}
            label=".SVG Translation"
          ></TitleWithIcon>
        )}

        <Box
          width={'100%'}
          padding={`${PADDING}px 0 ${PADDING}px`}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          gap={`${PADDING}px`}
        >
          <Box flex={1}>
            <Autocomplete
              fullWidth
              options={MOCK_ETHNOLOGUE_OPTIONS}
              label="Ethnologue"
            ></Autocomplete>
          </Box>
          <Box flex={1}>
            <Input fullWidth label="Language ID"></Input>
          </Box>
        </Box>

        {error && <div>Error: {error}</div>}

        {!originalSvg && (
          <Button variant="contained" component="label" fullWidth>
            Upload .svg File
            <input
              hidden
              multiple
              accept="image/svg+xml"
              onChange={fileHandler}
              type="file"
            />
          </Button>
        )}

        {!originalSvg && translatedMapsList.length > 0 && (
          <Box width={'100%'} paddingTop={`${PADDING}px`}>
            <ButtonList
              label="Translated Maps"
              items={items}
              onClick={() => {
                history.push('/svg-translated-map');
              }}
            ></ButtonList>
          </Box>
        )}

        <Box
          display="flex"
          flexDirection={'column'}
          justifyContent="start"
          paddingLeft={`${PADDING / 2}px`}
        >
          {originalSvg && (
            <Box>
              <Typography variant={'caption'}>Uploaded map</Typography>
              <TransformWrapper>
                <TransformComponent>
                  <img
                    width={`${windowWidth - PADDING}px`}
                    height={'auto'}
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      originalSvg,
                    )}`}
                    alt="Original svg"
                  />
                </TransformComponent>
              </TransformWrapper>
            </Box>
          )}

          {translatedSvg && (
            <>
              <Box>
                <Typography variant={'caption'}>Translated map</Typography>
                <TransformWrapper>
                  <TransformComponent>
                    <img
                      width={`${windowWidth - PADDING}px`}
                      height={'auto'}
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(
                        translatedSvg,
                      )}`}
                      alt="translated svg"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </Box>
              <Box
                display="flex"
                flexDirection={'column'}
                justifyContent="start"
                alignItems={'center'}
              >
                {textContents.map((text, i) => (
                  <Box
                    key={i}
                    display={'flex'}
                    flexDirection={'row'}
                    paddingTop={`${PADDING / 2}px`}
                    width={1}
                    justifyContent={'space-between'}
                  >
                    <Typography width={0.5} variant="body1">
                      {text}
                    </Typography>
                    <Box width={0.5}>
                      <DebounceInput
                        element={Input}
                        id={`text-${i}`}
                        label="Translate"
                        debounceTimeout={500}
                        onChange={(e) => {
                          const newTranslations = [...translations];
                          newTranslations[i] = e.target.value;
                          setTranslations(newTranslations);
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { innerWidth, innerHeight } = window;
  return innerWidth;
}
