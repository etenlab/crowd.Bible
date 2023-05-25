import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as DataViewerBlue } from './svg-sources/data-viewer-blue.svg';
import { ReactComponent as DataViewerDark } from './svg-sources/data-viewer-dark.svg';
import { ReactComponent as DataViewerGray } from './svg-sources/data-viewer-gray.svg';
import { ReactComponent as DataViewerRed } from './svg-sources/data-viewer-red.svg';
import { ReactComponent as DataViewerWhite } from './svg-sources/data-viewer-white.svg';
import { DiColors } from './colors';

export function DiDataViewer(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let DataViewer = DataViewerDark;
  if (color) {
    switch (color) {
      case 'blue':
        DataViewer = DataViewerBlue;
        break;
      case 'gray':
        DataViewer = DataViewerGray;
        break;
      case 'red':
        DataViewer = DataViewerRed;
        break;
      case 'white':
        DataViewer = DataViewerWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <DataViewer />
    </SvgIcon>
  );
}
