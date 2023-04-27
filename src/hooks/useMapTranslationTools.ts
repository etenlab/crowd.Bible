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

export const FETCH_FILES_QUERY = gql`
  query Query($fileId: Int!) {
    file(id: $fileId) {
      id
      fileHash
      fileName
      fileType
    }
  }
`;

export function useMapTranslationTools() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback },
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
          console.log(res);
          const { id, fileName, fileHash, fileUrl } = res.data.uploadFile;
          afterSuccess({ id, fileName, fileHash, fileUrl });
        })
        .catch((error: any) => {
          alertFeedback('error', `Error on map uploading: ${error.message}`);
          console.log(JSON.stringify(error));
        });
    },
    [alertFeedback, apolloClient],
  );

  const fetchMapFiles = useCallback(
    async (hash: string) => {
      apolloClient.query({
        query: FETCH_FILES_QUERY,
        variables: { hash },
      });
    },
    [apolloClient],
  );

  return {
    sendMapFile,
    fetchMapFiles,
  };
}
