import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ChooseBlue } from './svg-sources/choose-blue.svg';
import { ReactComponent as ChooseDark } from './svg-sources/choose-dark.svg';
import { ReactComponent as ChooseGray } from './svg-sources/choose-gray.svg';
import { ReactComponent as ChooseRed } from './svg-sources/choose-red.svg';
import { ReactComponent as ChooseWhite } from './svg-sources/choose-white.svg';
import { DiColors } from './colors';

export function DiChoose(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Choose = ChooseDark;
  if (color) {
    switch (color) {
      case 'blue':
        Choose = ChooseBlue;
        break;
      case 'gray':
        Choose = ChooseGray;
        break;
      case 'red':
        Choose = ChooseRed;
        break;
      case 'white':
        Choose = ChooseWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Choose />
    </SvgIcon>
  );
}
