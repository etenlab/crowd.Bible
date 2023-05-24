import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as DropDownBlue } from './svg-sources/drop-down-blue.svg';
import { ReactComponent as DropDownDark } from './svg-sources/drop-down-dark.svg';
import { ReactComponent as DropDownGray } from './svg-sources/drop-down-gray.svg';
import { ReactComponent as DropDownRed } from './svg-sources/drop-down-red.svg';
import { ReactComponent as DropDownWhite } from './svg-sources/drop-down-white.svg';
import { DiColors } from './colors';

export function DiDropDown(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let DropDown = DropDownDark;
  if (color) {
    switch (color) {
      case 'blue':
        DropDown = DropDownBlue;
        break;
      case 'gray':
        DropDown = DropDownGray;
        break;
      case 'red':
        DropDown = DropDownRed;
        break;
      case 'white':
        DropDown = DropDownWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <DropDown />
    </SvgIcon>
  );
}
