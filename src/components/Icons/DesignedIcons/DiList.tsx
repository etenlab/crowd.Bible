import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ListBlue } from './svg-sources/list-blue.svg';
import { ReactComponent as ListDark } from './svg-sources/list-dark.svg';
import { ReactComponent as ListGray } from './svg-sources/list-gray.svg';
import { ReactComponent as ListRed } from './svg-sources/list-red.svg';
import { ReactComponent as ListWhite } from './svg-sources/list-white.svg';
import { DiColors } from './colors';

export function DiList(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let List = ListDark;
  if (color) {
    switch (color) {
      case 'blue':
        List = ListBlue;
        break;
      case 'gray':
        List = ListGray;
        break;
      case 'red':
        List = ListRed;
        break;
      case 'white':
        List = ListWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <List />
    </SvgIcon>
  );
}
