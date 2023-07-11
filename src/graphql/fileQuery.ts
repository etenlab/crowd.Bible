import { gql } from '@apollo/client';

export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $file_type: String!, $file_size: Int!) {
    uploadFile(file: $file, file_type: $file_type, file_size: $file_size) {
      id
      fileName
      fileHash
      fileSize
      fileType
      fileUrl
    }
  }
`;
