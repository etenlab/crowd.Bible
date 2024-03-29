import React, { useCallback, useRef, useState } from 'react';
import JSZip from 'jszip';

import {
  CrowdBibleUI,
  MuiMaterial,
  Input,
  Button,
  LangSelector,
  LanguageInfo,
  FadeSpinner,
  IconBox,
} from '@eten-lab/ui-kit';

import { NodeTypeConst } from '@eten-lab/core';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Proskomma } = require('proskomma');

const { LabelWithIcon } = CrowdBibleUI;
const { Stack, Link } = MuiMaterial;

export function FileImportPage() {
  const {
    states: {
      global: { singletons },
    },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const downloadRef = useRef<HTMLAnchorElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [langInfo, setLangInfo] = useState<LanguageInfo>();
  const [downloadLink, setDownloadLink] = useState('');
  const [wordProgress, setWordProgress] = useState('');

  const handleLangChange = useCallback(
    (_langTag: string, langInfo: LanguageInfo) => {
      setLangInfo(langInfo);
      // setMapsByLang(langInfo);
    },
    [],
  );
  const openFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.item(0)) {
      return;
    }
    try {
      const zip = await JSZip.loadAsync(e.target.files[0]);
      const words = [];
      for (const filename of Object.keys(zip.files)) {
        if (filename.endsWith('.usx')) {
          const fileData = await zip.files[filename].async('string');
          const pk = new Proskomma();
          pk.importDocument(
            {
              lang: 'eng',
              abbr: 'web',
            },
            'usx',
            fileData,
            {},
          );
          const result = pk.gqlQuerySync(`{
          documents {
            mainSequence {
              blocks {
                items {
                  type
                  subType
                  payload
                }
              }
            }
          }
        }`);
          for (const block of result.data.documents[0].mainSequence.blocks) {
            for (const item of block.items) {
              if (item.type === 'token' && item.subType === 'wordLike') {
                words.push(item.payload);
              }
            }
          }
          break;
        }
      }
      if (langInfo) {
        for (const [index, word] of words.entries()) {
          await singletons?.wordService.createOrFindWordOrPhraseWithLang(
            word,
            langInfo,
            NodeTypeConst.WORD,
          );
          setWordProgress(((index / words.length) * 100).toFixed(1));
        }
        setWordProgress('success');
      }
    } catch (err) {
      logger.error(err);
      setWordProgress('failed');
    }
  };

  if (wordProgress === '') {
    return (
      <PageLayout>
        <Stack
          justifyContent="space-between"
          sx={{ height: 'calc(100vh - 68px)' }}
        >
          <Stack sx={{ padding: '20px', overflowY: 'auto' }}>
            <LabelWithIcon
              label={tr('File import')}
              // icon={<FiX />}
              color="gray"
              onClick={() => {}}
            />
          </Stack>
          <Stack
            display={'flex'}
            gap={'16px'}
            sx={{ paddingX: '20px', overflowY: 'auto', flexGrow: 1 }}
          >
            <LangSelector
              label={tr('Select the source language')}
              onChange={handleLangChange}
              selected={langInfo}
            />
            <Input
              placeholder={tr('File URL...')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDownloadLink(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                downloadRef.current?.click();
              }}
              color={'dark'}
              variant="contained"
            >
              {tr('Download')}
            </Button>
            <Link href={downloadLink} hidden ref={downloadRef} />
            <Button
              onClick={() => {
                importRef.current?.click();
              }}
              color={'dark'}
              variant="contained"
            >
              {tr('Import')}
            </Button>
            <Input
              type={'file'}
              inputRef={importRef}
              onChange={openFileHandler}
              hidden
            />
          </Stack>
        </Stack>
      </PageLayout>
    );
  }

  if (wordProgress === 'success') {
    return (
      <PageLayout>
        <Stack sx={{ pt: '25vh' }}>
          <IconBox isSuccess text={tr('Process completed successfully!')} />
        </Stack>
      </PageLayout>
    );
  }

  if (wordProgress === 'failed') {
    return (
      <PageLayout>
        <Stack sx={{ pt: '25vh' }}>
          <IconBox isSuccess text={tr('Oops... something went wrong!')} />
        </Stack>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Stack sx={{ pt: '20vh' }}>
        <FadeSpinner color="black" progress={wordProgress} />
      </Stack>
    </PageLayout>
  );
}
