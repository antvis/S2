import React from 'react';

export function ValueIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      className="antv-s2-icon"
      {...props}
    >
      <g fill="currentColor" fillRule="evenodd">
        <path d="M4.229 3.771h7v8h-7z" />
        <path d="M4.457 11.229h6.772V3.77H4.457zm-.686 0V3.77h-3v7.543h3zM11.23 3V.771H.77V3zM12 0v12H0V0z" />
      </g>
    </svg>
  );
}
