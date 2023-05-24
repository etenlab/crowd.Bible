import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as FeedbackBlue } from './svg-sources/feedback-blue.svg';
import { ReactComponent as FeedbackDark } from './svg-sources/feedback-dark.svg';
import { ReactComponent as FeedbackGray } from './svg-sources/feedback-gray.svg';
import { ReactComponent as FeedbackRed } from './svg-sources/feedback-red.svg';
import { ReactComponent as FeedbackWhite } from './svg-sources/feedback-white.svg';
import { DiColors } from './colors';

export function DiFeedback(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Feedback = FeedbackDark;
  if (color) {
    switch (color) {
      case 'blue':
        Feedback = FeedbackBlue;
        break;
      case 'gray':
        Feedback = FeedbackGray;
        break;
      case 'red':
        Feedback = FeedbackRed;
        break;
      case 'white':
        Feedback = FeedbackWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Feedback />
    </SvgIcon>
  );
}
