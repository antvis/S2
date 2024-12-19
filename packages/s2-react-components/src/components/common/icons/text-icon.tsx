import React from 'react';

export function TextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12.6}
      height={12.6}
      className="antv-s2-icon"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path
        fill="currentColor"
        d="M86.016 805.888H0l143.872-529.92h79.36l144.896 529.92h-91.136l-29.696-109.056H115.2S85.504 805.888 86.016 805.888M225.28 613.376 181.248 455.68 138.24 613.376zM519.168 430.08c24.576-16.384 47.616-25.088 69.12-25.088 30.72 0 58.368 14.848 81.92 44.032 24.064 29.184 35.328 72.192 35.328 128.512 0 44.032-7.168 83.456-22.528 118.272-14.848 34.816-35.328 62.976-60.416 83.456-26.112 20.992-57.856 31.232-95.232 31.232-15.36-.512-31.232-1.536-46.592-3.584-4.096-.512-8.704-1.024-12.8-1.536h-66.56V256h81.92v206.336c11.264-12.8 23.04-23.552 35.84-32.256M483.84 587.264v135.168c13.824 3.072 26.112 4.608 37.376 4.608 27.648 0 50.176-11.776 69.12-36.352 19.456-25.088 28.672-59.392 28.672-104.96 0-32.256-5.12-55.296-14.848-70.144-9.216-13.824-18.432-19.968-28.672-19.968-12.288 0-27.136 7.68-44.544 24.064-16.896 16.896-32.768 39.424-47.104 67.584m529.92 207.36c-36.864 14.336-71.68 20.992-104.96 20.992-32.768.512-64.512-9.216-91.648-27.136-27.136-18.432-48.64-44.032-62.464-73.728-14.848-30.72-22.528-65.536-22.528-104.448 0-58.88 16.896-108.032 51.2-146.944 33.792-38.912 75.264-58.88 123.392-58.88 34.304 0 70.144 7.168 108.032 21.504l10.24 4.096v95.232l-20.992-10.752c-34.816-17.92-65.536-26.624-92.16-26.624-16.896 0-32.768 4.608-47.104 13.824-13.824 8.704-25.088 23.04-32.768 42.496-8.192 19.968-12.288 41.472-12.288 63.488 0 28.672 7.68 55.808 24.064 82.432 14.848 24.576 37.888 36.352 71.168 36.352 10.752 0 21.504-1.024 31.744-2.56 9.728-1.536 29.696-8.192 58.88-18.944l19.456-7.68v92.672z"
      />
    </svg>
  );
}