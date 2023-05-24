import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as SearchBlue } from './svg-sources/search-blue.svg';
import { ReactComponent as SearchDark } from './svg-sources/search-dark.svg';
import { ReactComponent as SearchGray } from './svg-sources/search-gray.svg';
import { ReactComponent as SearchRed } from './svg-sources/search-red.svg';
import { ReactComponent as SearchWhite } from './svg-sources/search-white.svg';
import { DiColors } from './colors';

export function DiSearch(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Search = SearchDark;
  if (color) {
    switch (color) {
      case 'blue':
        Search = SearchBlue;
        break;
      case 'gray':
        Search = SearchGray;
        break;
      case 'red':
        Search = SearchRed;
        break;
      case 'white':
        Search = SearchWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Search />
    </SvgIcon>
  );
}
