import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as FileTextBlue } from './svg-sources/file-text-blue.svg';
import { ReactComponent as FileTextDark } from './svg-sources/file-text-dark.svg';
import { ReactComponent as FileTextGray } from './svg-sources/file-text-gray.svg';
import { ReactComponent as FileTextRed } from './svg-sources/file-text-red.svg';
import { ReactComponent as FileTextWhite } from './svg-sources/file-text-white.svg';
import { DiColors } from './colors';

export function DiFileText(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let FileText = FileTextDark;
  if (color) {
    switch (color) {
      case 'blue':
        FileText = FileTextBlue;
        break;
      case 'gray':
        FileText = FileTextGray;
        break;
      case 'red':
        FileText = FileTextRed;
        break;
      case 'white':
        FileText = FileTextWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <FileText />
    </SvgIcon>
  );
}
