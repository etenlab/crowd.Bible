import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as PhraseBlue } from './svg-sources/phrase-blue.svg';
import { ReactComponent as PhraseDark } from './svg-sources/phrase-dark.svg';
import { ReactComponent as PhraseGray } from './svg-sources/phrase-gray.svg';
import { ReactComponent as PhraseRed } from './svg-sources/phrase-red.svg';
import { ReactComponent as PhraseWhite } from './svg-sources/phrase-white.svg';
import { DiColors } from './colors';

export function DiPhrase(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Phrase = PhraseDark;
  if (color) {
    switch (color) {
      case 'blue':
        Phrase = PhraseBlue;
        break;
      case 'gray':
        Phrase = PhraseGray;
        break;
      case 'red':
        Phrase = PhraseRed;
        break;
      case 'white':
        Phrase = PhraseWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Phrase />
    </SvgIcon>
  );
}
