import { IonContent } from '@ionic/react';
import { useCallback, useMemo, useState } from 'react';
import { type INode, parseSync, stringify } from 'svgson';
import { FormLabel, Button, Box, FormControl, TextField } from '@mui/material';
import { Alert } from '@eten-lab/ui-kit';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export const SvgTranslationPage = () => {
  const [originalSvg, setOriginalSvg] = useState(null as null | string);
  const [error, setError] = useState('');
  const [translateTo, setTranslateTo] = useState('');
  const [translations, setTranslations] = useState([] as string[]);
  const [textContents, setTextContents] = useState([] as string[]);
  const [parsed, setParsed] = useState<INode | null>(null);

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

  if (textContents.length === 0 && originalSvg) {
    debugger;
    return <Alert severity="warning">No text or textPath tags found</Alert>;
  }

  return (
    <IonContent>
      <Box
        display="flex"
        flexDirection={'column'}
        justifyContent="start"
        alignItems={'center'}
        padding="20px"
      >
        <Button variant="contained" component="label">
          Upload SVG
          <input
            hidden
            multiple
            accept="image/svg+xml"
            onChange={fileHandler}
            type="file"
          />
        </Button>

        {error && <div>Error: {error}</div>}

        {translatedSvg && (
          <Box display="flex" flexDirection={'column'} justifyContent="start">
            {originalSvg && (
              <Box paddingBottom={'10px'}>
                <TransformWrapper>
                  <TransformComponent>
                    <img
                      width={'100%'}
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

            <FormControl>
              {/* <InputLabel htmlFor="my-input">Translate to</InputLabel> */}
              <TextField
                id="language"
                label="Translate to"
                variant="outlined"
                placeholder="SIL language code"
                onChange={(e) => {
                  setTranslateTo(e.target.value);
                }}
                error={translateTo.length !== 3}
              />
            </FormControl>

            <Box
              display="flex"
              flexDirection={'column'}
              justifyContent="start"
              alignItems={'center'}
              paddingBottom={'10px'}
            >
              {textContents.map((text, i) => (
                <FormControl margin="dense" key={i}>
                  <FormLabel>{text}</FormLabel>
                  <TextField
                    id={`text-${i}`}
                    variant="filled"
                    placeholder="Your translation"
                    onChange={(e) => {
                      const newTranslations = [...translations];
                      newTranslations[i] = e.target.value;
                      setTranslations(newTranslations);
                    }}
                  />
                  {/* </Box> */}
                </FormControl>
              ))}
            </Box>

            <Box paddingBottom={'10px'}>
              <TransformWrapper>
                <TransformComponent>
                  <img
                    width={'100%'}
                    height={'auto'}
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      translatedSvg,
                    )}`}
                    alt="translated svg"
                  />
                </TransformComponent>
              </TransformWrapper>
            </Box>
          </Box>
        )}
      </Box>
    </IonContent>
  );
};

/**
 * Should iterate over INode and its children in a consistent order
 * @param node starting node
 * @param skipNodeNames node names to exclude with all its children
 * @param cb callbacke to be applied
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
