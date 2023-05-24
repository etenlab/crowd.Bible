import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as SettingsBlue } from './svg-sources/settings-blue.svg';
import { ReactComponent as SettingsDark } from './svg-sources/settings-dark.svg';
import { ReactComponent as SettingsGray } from './svg-sources/settings-gray.svg';
import { ReactComponent as SettingsRed } from './svg-sources/settings-red.svg';
import { ReactComponent as SettingsWhite } from './svg-sources/settings-white.svg';
import { DiColors } from './colors';

export function DiSettings(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Settings = SettingsDark;
  if (color) {
    switch (color) {
      case 'blue':
        Settings = SettingsBlue;
        break;
      case 'gray':
        Settings = SettingsGray;
        break;
      case 'red':
        Settings = SettingsRed;
        break;
      case 'white':
        Settings = SettingsWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Settings />
    </SvgIcon>
  );
}
