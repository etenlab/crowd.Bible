import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as VideoBlue } from './svg-sources/video-blue.svg';
import { ReactComponent as VideoDark } from './svg-sources/video-dark.svg';
import { ReactComponent as VideoGray } from './svg-sources/video-gray.svg';
import { ReactComponent as VideoRed } from './svg-sources/video-red.svg';
import { ReactComponent as VideoWhite } from './svg-sources/video-white.svg';
import { DiColors } from './colors';

export function DiVideo(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Video = VideoDark;
  if (color) {
    switch (color) {
      case 'blue':
        Video = VideoBlue;
        break;
      case 'gray':
        Video = VideoGray;
        break;
      case 'red':
        Video = VideoRed;
        break;
      case 'white':
        Video = VideoWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Video />
    </SvgIcon>
  );
}
