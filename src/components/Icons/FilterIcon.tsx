import React from 'react';

interface IProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: React.MouseEventHandler;
}
export function FilterIcon(props: IProps) {
  const { width = 20, height = 18, className } = props;
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 1H1L8.2 9.40889V15.2222L11.8 17V9.40889L19 1Z"
        stroke="#5C6673"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default FilterIcon;
