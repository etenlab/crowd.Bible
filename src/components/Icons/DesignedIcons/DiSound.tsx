import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as SoundBlue } from './svg-sources/sound-blue.svg';
import { ReactComponent as SoundDark } from './svg-sources/sound-dark.svg';
import { ReactComponent as SoundGray } from './svg-sources/sound-gray.svg';
import { ReactComponent as SoundRed } from './svg-sources/sound-red.svg';
import { ReactComponent as SoundWhite } from './svg-sources/sound-white.svg';
import { DiColors } from './colors';

export function DiSound(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Sound = SoundDark;
  if (color) {
    switch (color) {
      case 'blue':
        Sound = SoundBlue;
        break;
      case 'gray':
        Sound = SoundGray;
        break;
      case 'red':
        Sound = SoundRed;
        break;
      case 'white':
        Sound = SoundWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Sound />
    </SvgIcon>
  );
}
