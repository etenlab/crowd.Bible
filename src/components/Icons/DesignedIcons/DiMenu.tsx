import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as MenuBlue } from './svg-sources/menu-blue.svg';
import { ReactComponent as MenuDark } from './svg-sources/menu-dark.svg';
import { ReactComponent as MenuGray } from './svg-sources/menu-gray.svg';
import { ReactComponent as MenuRed } from './svg-sources/menu-red.svg';
import { ReactComponent as MenuWhite } from './svg-sources/menu-white.svg';
import { DiColors } from './colors';

export function DiMenu(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Menu = MenuDark;
  if (color) {
    switch (color) {
      case 'blue':
        Menu = MenuBlue;
        break;
      case 'gray':
        Menu = MenuGray;
        break;
      case 'red':
        Menu = MenuRed;
        break;
      case 'white':
        Menu = MenuWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Menu />
    </SvgIcon>
  );
}
