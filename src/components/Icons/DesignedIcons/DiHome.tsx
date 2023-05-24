import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as HomeBlue } from './svg-sources/home-blue.svg';
import { ReactComponent as HomeDark } from './svg-sources/home-dark.svg';
import { ReactComponent as HomeGray } from './svg-sources/home-gray.svg';
import { ReactComponent as HomeRed } from './svg-sources/home-red.svg';
import { ReactComponent as HomeWhite } from './svg-sources/home-white.svg';
import { DiColors } from './colors';

export function DiHome(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Home = HomeDark;
  if (color) {
    switch (color) {
      case 'blue':
        Home = HomeBlue;
        break;
      case 'gray':
        Home = HomeGray;
        break;
      case 'red':
        Home = HomeRed;
        break;
      case 'white':
        Home = HomeWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Home />
    </SvgIcon>
  );
}
