import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as AskQuestionBlue } from './svg-sources/ask-question-blue.svg';
import { ReactComponent as AskQuestionDark } from './svg-sources/ask-question-dark.svg';
import { ReactComponent as AskQuestionGray } from './svg-sources/ask-question-gray.svg';
import { ReactComponent as AskQuestionRed } from './svg-sources/ask-question-red.svg';
import { ReactComponent as AskQuestionWhite } from './svg-sources/ask-question-white.svg';
import { DiColors } from './colors';

export function DiAskQuestion(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let AskQuestion = AskQuestionDark;
  if (color) {
    switch (color) {
      case 'blue':
        AskQuestion = AskQuestionBlue;
        break;
      case 'gray':
        AskQuestion = AskQuestionGray;
        break;
      case 'red':
        AskQuestion = AskQuestionRed;
        break;
      case 'white':
        AskQuestion = AskQuestionWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <AskQuestion />
    </SvgIcon>
  );
}
