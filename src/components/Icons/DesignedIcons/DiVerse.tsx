import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as VerseBlue } from './svg-sources/verse-blue.svg';
import { ReactComponent as VerseDark } from './svg-sources/verse-dark.svg';
import { ReactComponent as VerseGray } from './svg-sources/verse-gray.svg';
import { ReactComponent as VerseRed } from './svg-sources/verse-red.svg';
import { ReactComponent as VerseWhite } from './svg-sources/verse-white.svg';
import { DiColors } from './colors';

export function DiVerse(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Verse = VerseDark;
  if (color) {
    switch (color) {
      case 'blue':
        Verse = VerseBlue;
        break;
      case 'gray':
        Verse = VerseGray;
        break;
      case 'red':
        Verse = VerseRed;
        break;
      case 'white':
        Verse = VerseWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Verse />
    </SvgIcon>
  );
}
