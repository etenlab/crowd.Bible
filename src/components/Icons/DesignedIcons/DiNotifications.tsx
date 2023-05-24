import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as NotificationsBlue } from './svg-sources/notifications-blue.svg';
import { ReactComponent as NotificationsDark } from './svg-sources/notifications-dark.svg';
import { ReactComponent as NotificationsGray } from './svg-sources/notifications-gray.svg';
import { ReactComponent as NotificationsRed } from './svg-sources/notifications-red.svg';
import { ReactComponent as NotificationsWhite } from './svg-sources/notifications-white.svg';
import { DiColors } from './colors';

export function DiNotifications(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Notifications = NotificationsDark;
  if (color) {
    switch (color) {
      case 'blue':
        Notifications = NotificationsBlue;
        break;
      case 'gray':
        Notifications = NotificationsGray;
        break;
      case 'red':
        Notifications = NotificationsRed;
        break;
      case 'white':
        Notifications = NotificationsWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Notifications />
    </SvgIcon>
  );
}
