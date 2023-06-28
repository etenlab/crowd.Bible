import { useCallback } from 'react';
import { useAppContext } from './useAppContext';
import { gql, useApolloClient } from '@apollo/client';
import {
  FeedbackTypes,
  UpOrDownVote,
  VoteTypes,
} from '@/constants/common.constant';
import axios from 'axios';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { nanoid } from 'nanoid';
import { parseSync } from 'svgson';
import { WordDto } from '../dtos/word.dto';
import { RelationshipTypeConst } from '@eten-lab/core';
import { WordMapper } from '../mappers/word.mapper';
import { compareLangInfo, wordProps2LangInfo } from '../utils/langUtils';
import { VotableItem } from '../dtos/votable-item.dto';
import { useVote } from './useVote';

export const UPLOAD_FILE_MUTATION = gql`
  mutation UploadFile($file: Upload!, $file_type: String!, $file_size: Int!) {
    uploadFile(file: $file, file_type: $file_type, file_size: $file_size) {
      id
      fileHash
      fileName
      fileUrl
    }
  }
`;

export const FETCH_FILE_INFO_QUERY = gql`
  query Query($fileId: Int!) {
    file(id: $fileId) {
      id
      fileHash
      fileName
      fileType
      fileUrl
    }
  }
`;

export enum eProcessStatus {
  NONE = 'NONE',
  PARSING_STARTED = 'PARSING_STARTED',
  PARSING_COMPLETED = 'PARSING_COMPLETED',
  COMPLETED = 'SAVED_IN_DB',
  FAILED = 'FAILED',
}

export type MapDetail = {
  id?: string;
  tempId?: string;
  status: eProcessStatus;
  words?: string[];
  mapFileId?: string;
  name?: string;
  langInfo: LanguageInfo;
};

export type WordItem = {
  translations?: Array<WordDto & { isNew: boolean }>;
} & WordDto;

export function useMapTranslationTools() {
  const {
    actions: { alertFeedback, createLoadingStack },
    states: {
      global: { singletons },
    },
    logger,
  } = useAppContext();
  const apolloClient = useApolloClient();
  const { getVotesStats, toggleVote } = useVote();

  const sendMapFile = useCallback(
    async (
      file: File,
      afterSuccess: (uploadedFileData: {
        id: string;
        fileName: string;
        fileHash: string;
        fileUrl: string;
      }) => void,
      afterFail: (error: Error) => void,
    ): Promise<void> => {
      apolloClient
        .mutate({
          mutation: UPLOAD_FILE_MUTATION,
          variables: {
            file,
            file_size: file.size,
            file_type: file.type,
          },
        })
        .then((res) => {
          logger.info(
            { at: 'useMapTranslationTools, gql mutation - upload map.' },
            `Map file (name:${file.name}) is uploaded.`,
          );
          const { id, fileName, fileHash, fileUrl } = res.data.uploadFile;
          afterSuccess({ id, fileName, fileHash, fileUrl });
        })
        .catch((error) => {
          alertFeedback(
            FeedbackTypes.ERROR,
            `Error on map uploading: ${error.message}`,
          );
          afterFail(error);
          logger.error(JSON.stringify(error));
        });
    },
    [alertFeedback, apolloClient, logger],
  );

  const getMapFileInfo = useCallback(
    async (
      id: string,
    ): Promise<{
      id?: string;
      fileName?: string;
      fileHash?: string;
      fileUrl?: string;
      fileType?: string;
    }> => {
      const res = await apolloClient
        .query({
          query: FETCH_FILE_INFO_QUERY,
          variables: { fileId: parseInt(id) },
        })
        .catch((error) => {
          alertFeedback(
            FeedbackTypes.ERROR,
            `Error on getting map file info: ${error.message}`,
          );
          logger.error(JSON.stringify(error));
        });
      if (!res) return {};
      return {
        id: res.data.file.id,
        fileName: res.data.file.fileName,
        fileHash: res.data.file.fileHash,
        fileUrl: res.data.file.fileUrl,
        fileType: res.data.file.fileType,
      };
    },
    [alertFeedback, apolloClient, logger],
  );

  const getFileDataBase64 = useCallback(
    async (fileId: string | undefined): Promise<string | undefined> => {
      if (!fileId) return;
      const { fileUrl } = await getMapFileInfo(fileId);
      if (!fileUrl) return;
      const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      return Buffer.from(res.data, 'binary').toString('base64');
    },
    [getMapFileInfo],
  );

  const setMapStatus = useCallback(
    (
      tempId: string,
      state: Partial<MapDetail>,
      setMapList: (value: React.SetStateAction<MapDetail[]>) => void,
    ) => {
      setMapList((prevList) => {
        const clonedList = [...prevList];
        const idx = clonedList.findIndex((m) => m.tempId === tempId);
        if (idx > -1) {
          clonedList[idx] = { ...clonedList[idx], ...state };
        }
        return clonedList;
      });
    },
    [],
  );

  const processFile = useCallback(
    (
      file: File,
      langInfo: LanguageInfo,
      setMapList: (value: React.SetStateAction<MapDetail[]>) => void,
    ) => {
      if (!singletons) {
        logger.error('---No singletons!');
        return;
      }
      if (!langInfo) return;
      if (!file) return;
      const fileName = file.name?.split('.')[0];
      const id = nanoid();
      let alreadyExists = false;

      setMapList((prevList) => {
        const existingIdx = prevList.findIndex((map) => map.name === fileName);
        if (existingIdx >= 0) {
          alertFeedback(FeedbackTypes.ERROR, 'File already exists');
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
          setMapStatus(id, { status: eProcessStatus.FAILED }, setMapList);
          alertFeedback(
            FeedbackTypes.ERROR,
            'Error while reading file. Read console for more info',
          );
          return;
        }
        const filecontent = evt.target.result;
        if (!filecontent) {
          setMapStatus(id, { status: eProcessStatus.FAILED }, setMapList);
          alertFeedback(
            FeedbackTypes.ERROR,
            'Error while reading file. Read console for more info',
          );
          return;
        }
        const originalSvg = filecontent.toString();
        const parsed = parseSync(originalSvg);
        const textArray: string[] = [];
        singletons.mapService.iterateOverINode(parsed, ['style'], (node) => {
          if (node.type === 'text' || node.type === 'textPath') {
            if (!node.value) return;
            if (node.value.trim().length <= 1) return;
            if (!isNaN(Number(node.value))) return;
            const isExist = textArray.findIndex((w) => w === node.value);
            if (isExist < 0) {
              textArray.push(node.value);
            }
          }
        });

        if (textArray.length === 0 && originalSvg) {
          setMapStatus(id, { status: eProcessStatus.FAILED }, setMapList);
          alertFeedback(FeedbackTypes.ERROR, 'No text or textPath tags found');
        } else {
          sendMapFile(
            file,
            (sentFileData) => {
              setMapStatus(
                id,
                {
                  status: eProcessStatus.PARSING_COMPLETED,
                  mapFileId: sentFileData.id,
                  words: textArray,
                },
                setMapList,
              );
            },
            (_error) => {
              setMapStatus(id, { status: eProcessStatus.FAILED }, setMapList);
            },
          );
        }
      };
      fileReader.readAsText(file);
    },
    [alertFeedback, logger, sendMapFile, setMapStatus, singletons],
  );

  const getWordsWithLangs = useCallback(
    async (
      sourceLangInfo: LanguageInfo,
      targetLangInfo: LanguageInfo,
    ): Promise<WordItem[]> => {
      if (!singletons) return [];
      const wordNodes =
        await singletons.wordService.getWordsWithLangAndRelationships(
          sourceLangInfo,
          [RelationshipTypeConst.WORD_MAP],
        );
      if (!wordNodes) return [];
      const wordItemList: Array<WordItem> = [];

      for (const wordNode of wordNodes) {
        const currWordItem: WordItem = WordMapper.entityToDto(wordNode);
        currWordItem.translations = [];

        for (const relationship of wordNode.toNodeRelationships || []) {
          if (
            relationship.relationship_type ===
            RelationshipTypeConst.WORD_TO_TRANSLATION
          ) {
            const translationNode = (
              await singletons.graphFirstLayerService.getNodesWithRelationshipsByIds(
                [relationship.to_node_id],
              )
            )[0];
            const translatedWord = WordMapper.entityToDto(translationNode);
            const translatedWordLangInfo = wordProps2LangInfo(translatedWord);

            if (compareLangInfo(translatedWordLangInfo, targetLangInfo)) {
              currWordItem.translations.push({
                ...translatedWord,
                isNew: false,
              });
            }
          }
        }
        wordItemList.push(currWordItem);
      }
      return wordItemList;
    },
    [singletons],
  );

  const changeTranslationVotes = useCallback(
    async (
      items: VotableItem[],
      setWordsVotableItems: React.Dispatch<React.SetStateAction<VotableItem[]>>,
      candidateId: Nanoid | null,
      upOrDown: UpOrDownVote,
    ) => {
      const { startLoading, stopLoading } = createLoadingStack();

      try {
        if (!candidateId) {
          throw new Error(`!candidateId: There is no candidateId`);
        }
        let translationIdx = -1;
        const wordIdx = items.findIndex((w) => {
          translationIdx = w.contents.findIndex(
            (t) => t.candidateId === candidateId,
          );
          return translationIdx >= 0;
        });

        startLoading();

        await toggleVote(candidateId, upOrDown === VoteTypes.UP); // if not upVote, it calculated as false and toggleVote treats false as downVote
        const votes = await getVotesStats(candidateId);
        if (translationIdx < 0) {
          throw new Error(
            `Can't find definition by candidateId ${candidateId}`,
          );
        }
        items[wordIdx].contents[translationIdx] = {
          ...items[wordIdx].contents[translationIdx],
          upVotes: votes?.upVotes || 0,
          downVotes: votes?.downVotes || 0,
        };
        setWordsVotableItems([...items]);
      } catch (error) {
        logger.error(error);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
      } finally {
        stopLoading();
      }
    },
    [toggleVote, getVotesStats, alertFeedback, createLoadingStack, logger],
  );

  return {
    sendMapFile,
    getMapFileInfo,
    getFileDataBase64,
    processFile,
    setMapStatus,
    getWordsWithLangs,
    changeTranslationVotes,
  };
}
