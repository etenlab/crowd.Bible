import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as FilterBlue } from './svg-sources/filter-blue.svg';
import { ReactComponent as FilterDark } from './svg-sources/filter-dark.svg';
import { ReactComponent as FilterGray } from './svg-sources/filter-gray.svg';
import { ReactComponent as FilterRed } from './svg-sources/filter-red.svg';
import { ReactComponent as FilterWhite } from './svg-sources/filter-white.svg';
import { DiColors } from './colors';

export function DiFilter(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Filter = FilterDark;
  if (color) {
    switch (color) {
      case 'blue':
        Filter = FilterBlue;
        break;
      case 'gray':
        Filter = FilterGray;
        break;
      case 'red':
        Filter = FilterRed;
        break;
      case 'white':
        Filter = FilterWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Filter />
    </SvgIcon>
  );
}
