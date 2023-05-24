import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as RoleBlue } from './svg-sources/role-blue.svg';
import { ReactComponent as RoleDark } from './svg-sources/role-dark.svg';
import { ReactComponent as RoleGray } from './svg-sources/role-gray.svg';
import { ReactComponent as RoleRed } from './svg-sources/role-red.svg';
import { ReactComponent as RoleWhite } from './svg-sources/role-white.svg';
import { DiColors } from './colors';

export function DiRole(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Role = RoleDark;
  if (color) {
    switch (color) {
      case 'blue':
        Role = RoleBlue;
        break;
      case 'gray':
        Role = RoleGray;
        break;
      case 'red':
        Role = RoleRed;
        break;
      case 'white':
        Role = RoleWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Role />
    </SvgIcon>
  );
}
