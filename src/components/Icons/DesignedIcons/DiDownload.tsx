import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as DownloadBlue } from './svg-sources/download-blue.svg';
import { ReactComponent as DownloadDark } from './svg-sources/download-dark.svg';
import { ReactComponent as DownloadGray } from './svg-sources/download-gray.svg';
import { ReactComponent as DownloadRed } from './svg-sources/download-red.svg';
import { ReactComponent as DownloadWhite } from './svg-sources/download-white.svg';
import { DiColors } from './colors';

export function DiDownload(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Download = DownloadDark;
  if (color) {
    switch (color) {
      case 'blue':
        Download = DownloadBlue;
        break;
      case 'gray':
        Download = DownloadGray;
        break;
      case 'red':
        Download = DownloadRed;
        break;
      case 'white':
        Download = DownloadWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Download />
    </SvgIcon>
  );
}
