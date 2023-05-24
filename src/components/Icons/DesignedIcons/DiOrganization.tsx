import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as OrganizationBlue } from './svg-sources/organization-blue.svg';
import { ReactComponent as OrganizationDark } from './svg-sources/organization-dark.svg';
import { ReactComponent as OrganizationGray } from './svg-sources/organization-gray.svg';
import { ReactComponent as OrganizationRed } from './svg-sources/organization-red.svg';
import { ReactComponent as OrganizationWhite } from './svg-sources/organization-white.svg';
import { DiColors } from './colors';

export function DiOrganization(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Organization = OrganizationDark;
  if (color) {
    switch (color) {
      case 'blue':
        Organization = OrganizationBlue;
        break;
      case 'gray':
        Organization = OrganizationGray;
        break;
      case 'red':
        Organization = OrganizationRed;
        break;
      case 'white':
        Organization = OrganizationWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Organization />
    </SvgIcon>
  );
}
