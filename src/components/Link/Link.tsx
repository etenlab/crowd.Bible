import { Link, LinkProps } from 'react-router-dom';

// type LinkProps = {

// }

export function CustomLink(props: LinkProps) {
  return (
    <Link {...props} style={{ color: 'inherit', textDecoration: 'none' }} />
  );
}
