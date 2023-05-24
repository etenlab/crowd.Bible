import { useCallback } from 'react';
import { useAppContext } from './useAppContext';
import { gql, useApolloClient } from '@apollo/client';

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

export function useMapTranslationTools() {
  const {
    actions: { alertFeedback },
    logger,
  } = useAppContext();
  const apolloClient = useApolloClient();

  const sendMapFile = useCallback(
    async (
      file: File,
      afterSuccess: (uploadedFileData: {
        id: string;
        fileName: string;
        fileHash: string;
        fileUrl: string;
      }) => void,
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
          alertFeedback('success', `Map file (name:${file.name}) uploaded.`);
          logger.info(res);
          const { id, fileName, fileHash, fileUrl } = res.data.uploadFile;
          afterSuccess({ id, fileName, fileHash, fileUrl });
        })
        .catch((error) => {
          alertFeedback('error', `Error on map uploading: ${error.message}`);
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
            'error',
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

  return {
    sendMapFile,
    getMapFileInfo,
  };
}
