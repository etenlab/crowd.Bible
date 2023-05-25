import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as LanguageBlue } from './svg-sources/language-blue.svg';
import { ReactComponent as LanguageDark } from './svg-sources/language-dark.svg';
import { ReactComponent as LanguageGray } from './svg-sources/language-gray.svg';
import { ReactComponent as LanguageRed } from './svg-sources/language-red.svg';
import { ReactComponent as LanguageWhite } from './svg-sources/language-white.svg';
import { DiColors } from './colors';

export function DiLanguage(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Language = LanguageDark;
  if (color) {
    switch (color) {
      case 'blue':
        Language = LanguageBlue;
        break;
      case 'gray':
        Language = LanguageGray;
        break;
      case 'red':
        Language = LanguageRed;
        break;
      case 'white':
        Language = LanguageWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Language />
    </SvgIcon>
  );
}
