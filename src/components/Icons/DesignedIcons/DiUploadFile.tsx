import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as UploadFileBlue } from './svg-sources/upload-file-blue.svg';
import { ReactComponent as UploadFileDark } from './svg-sources/upload-file-dark.svg';
import { ReactComponent as UploadFileGray } from './svg-sources/upload-file-gray.svg';
import { ReactComponent as UploadFileRed } from './svg-sources/upload-file-red.svg';
import { ReactComponent as UploadFileWhite } from './svg-sources/upload-file-white.svg';
import { DiColors } from './colors';

export function DiUploadFile(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let UploadFile = UploadFileDark;
  if (color) {
    switch (color) {
      case 'blue':
        UploadFile = UploadFileBlue;
        break;
      case 'gray':
        UploadFile = UploadFileGray;
        break;
      case 'red':
        UploadFile = UploadFileRed;
        break;
      case 'white':
        UploadFile = UploadFileWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <UploadFile />
    </SvgIcon>
  );
}
