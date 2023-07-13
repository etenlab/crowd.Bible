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
import { WordDto } from '@/dtos/word.dto';
import {
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@eten-lab/core';
import { WordMapper } from '@/mappers/word.mapper';
import {
  compareLangInfo,
  langInfo2tag,
  wordProps2LangInfo,
} from '../utils/langUtils';
import { VotableItem } from '@/dtos/votable-item.dto';
import { useVote } from './useVote';
import * as svgson from 'svgson';
import { MapDto } from '@/dtos/map.dto';
const MAPFILE_EXTENSION = 'svg';

export type MapTranslationResult = {
  translatedMap: string;
  translations: Array<{ source: string; translation: string }>;
};

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

export const UPDATE_FILE_MUTATION = gql`
  mutation UpdateFile(
    $id: Int!
    $file: Upload!
    $file_type: String!
    $file_size: Int!
  ) {
    updateFile(
      id: $id
      file: $file
      file_type: $file_type
      file_size: $file_size
    ) {
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

  const updateMapFile = useCallback(
    async (
      file: File,
      id: number,
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
          mutation: UPDATE_FILE_MUTATION,
          variables: {
            id,
            file,
            file_size: file.size,
            file_type: file.type,
          },
        })
        .then((res) => {
          logger.info(
            { at: 'useMapTranslationTools, gql mutation - update map.' },
            `Map file (name:${file.name}) is updated.`,
          );
          const { id, fileName, fileHash, fileUrl } = res.data.updateFile;
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

  const getFileDataAsBuffer = useCallback(
    async (fileId: string | undefined): Promise<Buffer | undefined> => {
      if (!fileId) return;
      const { fileUrl } = await getMapFileInfo(fileId);
      if (!fileUrl) return;
      const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      return Buffer.from(res.data, 'binary');
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

  /**
   * creates new translated map (or updates if tragetMap is given) at cpg server, ( therefore at aws also), creates
   * map node at the graph database, creates relation 'source map'-> 'translated map',
   * saves and/or assigns translated words to translated map
   *
   */
  const processTranslatedMap = useCallback(
    (
      mtr: MapTranslationResult,
      langInfo: LanguageInfo,
      fileNamePrefix: string,
      sourceMapNodeId: string,
      targetMap: MapDto | null,
    ) => {
      if (!singletons) {
        logger.error('---No singletons!');
        return;
      }
      if (!langInfo) return;
      if (!mtr) return;

      const mapBlob = new Blob([mtr.translatedMap], { type: 'text/plain' });
      const mapFileTosave = new File(
        [mapBlob],
        `${fileNamePrefix}-${langInfo2tag(langInfo)}.${MAPFILE_EXTENSION}`,
        { type: 'image/svg+xml' },
      );
      const words = mtr.translations.map((tr) => tr.translation);

      const afterSave = async ({
        id,
        fileName,
      }: {
        id: string;
        fileName: string;
      }) => {
        let mapId: string | null;
        if (targetMap) {
          mapId = targetMap.id;
        } else {
          mapId = await singletons.mapService.saveMap(langInfo, {
            [PropertyKeyConst.NAME]: fileName.split('.').at(-2) || fileName,
            [PropertyKeyConst.MAP_FILE_ID]: id,
            [PropertyKeyConst.EXT]: MAPFILE_EXTENSION,
            [PropertyKeyConst.IS_PROCESSING_FINISHED]: false, // still need to process words
          });
        }

        if (!mapId) {
          throw new Error(`Error with creating translated map node`);
        }
        await singletons.graphFirstLayerService.createRelationship(
          sourceMapNodeId,
          mapId,
          RelationshipTypeConst.MAP_TO_TRANSLATED_MAP,
        );

        await singletons.mapService.processMapWords(words, langInfo, mapId);
        await singletons.graphSecondLayerService.addNewNodePropertiesNoChecks(
          mapId,
          {
            [PropertyKeyConst.IS_PROCESSING_FINISHED]: true,
          },
        );
        await singletons.driver.save();
        alertFeedback(
          FeedbackTypes.SUCCESS,
          `Map file (name:${fileName}) is created.`,
        );
      };

      if (!isNaN(Number(targetMap?.mapFileId))) {
        updateMapFile(
          mapFileTosave,
          Number(targetMap!.mapFileId),
          afterSave,
          (_error) => {
            logger.error(
              {
                at: 'useMapTranslationTools#processTranslatedMap',
                when: `try to save translated map file`,
              },
              JSON.stringify(_error),
            );
          },
        );
      } else {
        sendMapFile(mapFileTosave, afterSave, (_error) => {
          logger.error(
            {
              at: 'useMapTranslationTools#processTranslatedMap',
              when: `try to save translated map file`,
            },
            JSON.stringify(_error),
          );
        });
      }
    },
    [alertFeedback, logger, sendMapFile, singletons, updateMapFile],
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
        const originalSvgString = filecontent.toString();

        const { foundWords } =
          singletons.mapService.parseSvgMapString(originalSvgString);

        if (foundWords.length === 0 && originalSvgString) {
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
                  words: foundWords,
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

  const getRecommendedTranslations = useCallback(
    async ({
      sourceLang,
      targetLang,
      sources,
      nodeType,
    }: {
      sourceLang: LanguageInfo;
      targetLang: LanguageInfo;
      sources: string[];
      nodeType: NodeTypeConst.WORD | NodeTypeConst.PHRASE;
    }): Promise<{ source: string; translation: string }[]> => {
      if (!singletons) {
        logger.error('---No singletons!');
        return [];
      }

      const translations: { source: string; translation: string }[] = [];

      for (const source of sources) {
        const translation =
          await singletons.translationService.getRecommendedTranslation({
            sourceLang,
            targetLang,
            source,
            nodeType,
          });
        if (translation) {
          translations.push({ source, translation });
        }
      }

      return translations;
    },
    [logger, singletons],
  );

  const translateMapString = useCallback(
    async (
      sourceSvgString: string,
      sourceLang: LanguageInfo,
      targetLang: LanguageInfo,
    ): Promise<MapTranslationResult | undefined> => {
      if (!singletons) {
        logger.error('---No singletons!');
        return;
      }
      const { transformedSvgINode, foundWords: sourceWords } =
        singletons.mapService.parseSvgMapString(sourceSvgString);

      const translations = await getRecommendedTranslations({
        sourceLang,
        targetLang,
        sources: sourceWords,
        nodeType: NodeTypeConst.WORD,
      });

      singletons.mapService.replaceINodeTagValues(
        transformedSvgINode,
        translations,
      );

      const translatedMap = await svgson.stringify(transformedSvgINode);

      return { translatedMap, translations };
    },

    [getRecommendedTranslations, logger, singletons],
  );

  const translateAndSaveOrUpdateFile = useCallback(
    async ({
      mapDetail,
      mapFileData,
      sourceLanguage,
      targetLanguage,
      targetMap,
    }: {
      mapDetail: MapDto;
      mapFileData: Buffer;
      sourceLanguage: LanguageInfo;
      targetLanguage: LanguageInfo;
      targetMap: MapDto | null;
    }) => {
      if (!mapDetail?.name || !mapFileData || !mapDetail?.id) return;
      if (!sourceLanguage || !targetLanguage) return;
      const mtr = await translateMapString(
        mapFileData.toString(),
        sourceLanguage,
        targetLanguage,
      );
      if (!mtr) return;
      await processTranslatedMap(
        mtr,
        targetLanguage,
        mapDetail.name,
        mapDetail.id,
        targetMap,
      );
    },
    [processTranslatedMap, translateMapString],
  );

  return {
    sendMapFile,
    getMapFileInfo,
    getFileDataAsBuffer,
    processFile,
    processTranslatedMap,
    setMapStatus,
    getWordsWithLangs,
    changeTranslationVotes,
    translateMapString,
    translateAndSaveOrUpdateFile,
  };
}
