import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as QaBlue } from './svg-sources/qa-blue.svg';
import { ReactComponent as QaDark } from './svg-sources/qa-dark.svg';
import { ReactComponent as QaGray } from './svg-sources/qa-gray.svg';
import { ReactComponent as QaRed } from './svg-sources/qa-red.svg';
import { ReactComponent as QaWhite } from './svg-sources/qa-white.svg';
import { DiColors } from './colors';

export function DiQa(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Qa = QaDark;
  if (color) {
    switch (color) {
      case 'blue':
        Qa = QaBlue;
        break;
      case 'gray':
        Qa = QaGray;
        break;
      case 'red':
        Qa = QaRed;
        break;
      case 'white':
        Qa = QaWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Qa />
    </SvgIcon>
  );
}
