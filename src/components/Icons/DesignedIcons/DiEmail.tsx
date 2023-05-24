import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as EmailBlue } from './svg-sources/email-blue.svg';
import { ReactComponent as EmailDark } from './svg-sources/email-dark.svg';
import { ReactComponent as EmailGray } from './svg-sources/email-gray.svg';
import { ReactComponent as EmailRed } from './svg-sources/email-red.svg';
import { ReactComponent as EmailWhite } from './svg-sources/email-white.svg';
import { DiColors } from './colors';

export function DiEmail(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Email = EmailDark;
  if (color) {
    switch (color) {
      case 'blue':
        Email = EmailBlue;
        break;
      case 'gray':
        Email = EmailGray;
        break;
      case 'red':
        Email = EmailRed;
        break;
      case 'white':
        Email = EmailWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Email />
    </SvgIcon>
  );
}
