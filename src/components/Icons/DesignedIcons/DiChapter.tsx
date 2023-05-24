import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ChapterBlue } from './svg-sources/chapter-blue.svg';
import { ReactComponent as ChapterDark } from './svg-sources/chapter-dark.svg';
import { ReactComponent as ChapterGray } from './svg-sources/chapter-gray.svg';
import { ReactComponent as ChapterRed } from './svg-sources/chapter-red.svg';
import { ReactComponent as ChapterWhite } from './svg-sources/chapter-white.svg';
import { DiColors } from './colors';

export function DiChapter(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Chapter = ChapterDark;
  if (color) {
    switch (color) {
      case 'blue':
        Chapter = ChapterBlue;
        break;
      case 'gray':
        Chapter = ChapterGray;
        break;
      case 'red':
        Chapter = ChapterRed;
        break;
      case 'white':
        Chapter = ChapterWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Chapter />
    </SvgIcon>
  );
}
