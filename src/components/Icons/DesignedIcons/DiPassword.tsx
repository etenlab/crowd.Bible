import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as PasswordBlue } from './svg-sources/password-blue.svg';
import { ReactComponent as PasswordDark } from './svg-sources/password-dark.svg';
import { ReactComponent as PasswordGray } from './svg-sources/password-gray.svg';
import { ReactComponent as PasswordRed } from './svg-sources/password-red.svg';
import { ReactComponent as PasswordWhite } from './svg-sources/password-white.svg';
import { DiColors } from './colors';

export function DiPassword(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Password = PasswordDark;
  if (color) {
    switch (color) {
      case 'blue':
        Password = PasswordBlue;
        break;
      case 'gray':
        Password = PasswordGray;
        break;
      case 'red':
        Password = PasswordRed;
        break;
      case 'white':
        Password = PasswordWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Password />
    </SvgIcon>
  );
}
