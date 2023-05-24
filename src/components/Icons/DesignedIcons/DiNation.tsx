import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as NationBlue } from './svg-sources/nation-blue.svg';
import { ReactComponent as NationDark } from './svg-sources/nation-dark.svg';
import { ReactComponent as NationGray } from './svg-sources/nation-gray.svg';
import { ReactComponent as NationRed } from './svg-sources/nation-red.svg';
import { ReactComponent as NationWhite } from './svg-sources/nation-white.svg';
import { DiColors } from './colors';

export function DiNation(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Nation = NationDark;
  if (color) {
    switch (color) {
      case 'blue':
        Nation = NationBlue;
        break;
      case 'gray':
        Nation = NationGray;
        break;
      case 'red':
        Nation = NationRed;
        break;
      case 'white':
        Nation = NationWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Nation />
    </SvgIcon>
  );
}
