import { Link, LinkProps } from 'react-router-dom';

export function CustomLink(props: LinkProps) {
  return (
    <Link {...props} style={{ color: 'inherit', textDecoration: 'none' }} />
  );
}
