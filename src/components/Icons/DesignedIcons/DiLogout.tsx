import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as LogoutBlue } from './svg-sources/logout-blue.svg';
import { ReactComponent as LogoutDark } from './svg-sources/logout-dark.svg';
import { ReactComponent as LogoutGray } from './svg-sources/logout-gray.svg';
import { ReactComponent as LogoutRed } from './svg-sources/logout-red.svg';
import { ReactComponent as LogoutWhite } from './svg-sources/logout-white.svg';
import { DiColors } from './colors';

export function DiLogout(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Logout = LogoutDark;
  if (color) {
    switch (color) {
      case 'blue':
        Logout = LogoutBlue;
        break;
      case 'gray':
        Logout = LogoutGray;
        break;
      case 'red':
        Logout = LogoutRed;
        break;
      case 'white':
        Logout = LogoutWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Logout />
    </SvgIcon>
  );
}
