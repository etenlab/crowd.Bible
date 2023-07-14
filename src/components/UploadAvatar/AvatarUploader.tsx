import { useCallback, useEffect } from 'react';

import { useMutation } from '@apollo/client';

import { useAppContext } from '@/hooks/useAppContext';

import { UPLOAD_FILE } from '@/graphql/fileQuery';

import { FeedbackTypes } from '@/constants/common.constant';

import { Button, MuiMaterial, useColorModeContext } from '@eten-lab/ui-kit';

const { CircularProgress, Avatar } = MuiMaterial;

const maxFileSize =
  process.env.REACT_APP_MAX_FILE_SIZE !== undefined
    ? +process.env.REACT_APP_MAX_FILE_SIZE
    : 1024 * 1024 * 50;

export function AvatarUploader({
  url,
  onAvatarUrl,
}: {
  url: string;
  onAvatarUrl: (url: string) => void;
}) {
  const { getColor } = useColorModeContext();

  const [
    uploadFile,
    { data: fileData, loading: fileLoading, error: fileError },
  ] = useMutation<UploadedFile>(UPLOAD_FILE);

  const {
    actions: { alertFeedback },
  } = useAppContext();

  useEffect(() => {
    if (fileLoading) {
      return;
    }

    if (!!fileError) {
      alertFeedback(FeedbackTypes.ERROR, 'Cannot upload avatar!');
    }

    if (fileData) {
      onAvatarUrl(fileData.uploadFile.fileUrl);
    }
  }, [fileData, fileLoading, fileError, alertFeedback, onAvatarUrl]);

  const fileHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        alertFeedback(FeedbackTypes.ERROR, 'No file selected');
        return;
      }

      e.target.value = '';

      if (file.size > maxFileSize) {
        alertFeedback(
          FeedbackTypes.WARNING,
          `Exceed max file size ( > ${process.env.REACT_APP_MAX_FILE_SIZE})!`,
        );
        return;
      }

      uploadFile({
        variables: { file, file_size: file.size, file_type: file.type },
      });
    },
    [alertFeedback, uploadFile],
  );

  return (
    <Button
      variant="text"
      component="label"
      disabled={fileLoading}
      sx={{ position: 'relative' }}
    >
      {fileLoading ? (
        <CircularProgress
          disableShrink
          sx={{
            color: 'text.blue-primary',
            fontWeight: 800,
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 1,
            translate: `-50% -50%`,
          }}
          size={24}
        />
      ) : null}
      <Avatar
        sx={{
          width: '100px',
          height: '100px',
          border: `1px solid ${getColor('gray')}`,
        }}
        src={url}
      />
      <input
        hidden
        multiple={false}
        accept="image/*"
        onChange={fileHandler}
        type="file"
      />
    </Button>
  );
}
