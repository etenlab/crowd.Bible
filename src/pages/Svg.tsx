import { useCallback, useEffect, useMemo, useState } from 'react';
import { INode, parseSync, stringify } from 'svgson';
import { FormLabel, Button, Box, FormControl, TextField } from '@mui/material';

export const Svg = () => {
  const [originalSvg, setOriginalSvg] = useState(null as null | string);
  const [error, setError] = useState('');
  const [translateTo, setTranslateTo] = useState('');
  const [translations, setTranslations] = useState([] as string[]);
  const [textContents, setTextContents] = useState([] as string[]);
  const [parsed, setParsed] = useState<INode | null>(null);

  useEffect(() => {
    if (!originalSvg) return;

    const parsed = parseSync(originalSvg);
    const textArray = [] as string[];

    iterateOverINode(parsed, (node) => {
      if (node.type === 'text' || node.type === 'textPath') {
        if (!node.value) return;
        textArray.push(node.value);
      }
    });

    setTextContents(textArray);
    setParsed(parsed);
  }, [originalSvg]);

  const translatedSvg: string = useMemo(() => {
    if (!parsed) return '';

    const trans = [...translations];

    iterateOverINode(parsed, (node) => {
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

      if (!f) return;

      const r = new FileReader();

      r!.onload = function (evt: ProgressEvent<FileReader>) {
        if (evt.target?.readyState !== 2) return;
        if (evt.target.error) {
          setError('Error while reading file. Read console for more info');
          console.error(evt.target.error);
          return;
        }

        const filecontent = evt.target.result;

        if (!filecontent) {
          setError('Error while reading file. Read console for more info');
          console.error(`filecontent is null after reading`);
          return;
        }

        setOriginalSvg(filecontent.toString());
      };

      r.readAsText(f);
    },
    [],
  );

  return (
    <Box
      display="flex"
      flexDirection={'column'}
      justifyContent="start"
      alignItems={'center'}
      padding="20px"
    >
      {!originalSvg && (
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
      )}

      {error && <div>Error: {error}</div>}
      {translatedSvg && (
        <Box display="flex" flexDirection={'column'} justifyContent="start">
          {originalSvg && (
            <Box paddingBottom={'10px'}>
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  originalSvg,
                )}`}
                alt="Original svg"
              />
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
          >
            {textContents.map((text, i) => (
              <Box
                width={'100%'}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                key={i}
              >
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
              </Box>
            ))}
          </Box>
          <Box paddingBottom={'10px'}>
            <img
              src={`data:image/svg+xml;utf8,${encodeURIComponent(
                translatedSvg,
              )}`}
              alt="translated svg"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Should iterate over INode and its children in a consistent order
function iterateOverINode(node: INode, cb: (node: INode) => void) {
  cb(node);

  for (const child of node.children || []) {
    iterateOverINode(child, cb);
  }
}
