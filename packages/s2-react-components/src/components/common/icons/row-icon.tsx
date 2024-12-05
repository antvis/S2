import React from 'react';

export function RowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      className="antv-s2-icon"
      {...props}
    >
      <g fill="currentColor" fillRule="evenodd">
        <path d="M.771 3.771h3v1.886h-3zm0 2.572h3V8.57h-3zM.771 9h3v2.229h-3z" />
        <path d="M.771 9v2.229H11.23V3.77H.77v1.886h3V3.771h.772v7.543H3.77V9.086h-3zm0-.771h3V6.343h-3zM11.23 3V.771H.77V3zM12 0v12H0V0z" />
      </g>
    </svg>
  );
}
