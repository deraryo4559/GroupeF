import React from 'react';

/**
 * メニューで使用する各種アイコン
 */
export const SendIcon = () => (
    <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L192.69,140H40a8,8,0,0,1,0-16H192.69L138.34,69.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
    </svg>
);

export const RequestIcon = () => (
    <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.34,122.34l72-72a8,8,0,0,1,11.32,11.32L63.31,116H216a8,8,0,0,1,0,16H63.31l54.35,54.34a8,8,0,0,1-11.32,11.32l-72-72A8,8,0,0,1,34.34,122.34Z"></path>
    </svg>
);

export const StatusIcon = () => (
    <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v40a8,8,0,0,0,8,8h24a8,8,0,0,0,0-16H136V80A8,8,0,0,0,128,72Zm-8,88a12,12,0,1,0,12,12A12,12,0,0,0,120,160Z"></path>
    </svg>
);

export const ProfileIcon = () => (
    <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
    </svg>
);

export const ReceiptIcon = () => (
    <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M216,40H40A16,16,0,0,0,24,56V208a8,8,0,0,0,12.24,6.78L64,192.75l27.76,22.03a8,8,0,0,0,9.6,0L128,192.75l26.64,22.03a8,8,0,0,0,9.6,0L192,192.75l27.76,22.03A8,8,0,0,0,232,208V56A16,16,0,0,0,216,40ZM88,144H72a8,8,0,0,1,0-16H88a8,8,0,0,1,0,16Zm96-32H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Zm0-32H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z" />
    </svg>
);

export const HistoryIcon = () => (
  <svg
    fill="currentColor"
    width="24"
    height="24"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm8-128v36.69l30.14 30.15a8 8 0 0 1-11.32 11.31l-32-32A8 8 0 0 1 120 128V88a8 8 0 0 1 16 0Z" />
  </svg>
);

export const HelpIcon = () => (
  <svg
    fill="currentColor"
    width="24"
    height="24"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M128,24A104,104 0 1,0 232,128A104.11,104.11 0 0,0 128,24ZM128,216A88,88 0 1,1 216,128A88.1,88.1 0 0,1 128,216ZM128,76A28,28 0 0,0 100,104a8,8 0 0,0 16,0 12,12 0 1,1 24,0c0,8-4,12-9,16s-11,8-11,20v4a8,8 0 0,0 16,0v-4c0-6,2-8,7-11 6-5,13-11,13-25A28,28 0 0,0 128,76Zm0,96a12,12 0 1,0 12,12A12,12 0 0,0 128,172Z" />
  </svg>
);

export const AiIcon = () => (
    <svg
    fill="currentColor"
    width="24"
    height="24"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 頭の外枠 */}
    <rect
      x="40"
      y="64"
      width="176"
      height="128"
      rx="16"
      ry="16"
      stroke="currentColor"
      strokeWidth="0"
    />
    {/* アンテナ */}
    <line
      x1="128"
      y1="32"
      x2="128"
      y2="64"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <circle cx="128" cy="24" r="8" fill="currentColor" />
    {/* 目 */}
    <circle cx="92" cy="112" r="12" fill="#000" />
    <circle cx="164" cy="112" r="12" fill="#000" />
    {/* 口 */}
    <rect
      x="92"
      y="152"
      width="72"
      height="20"
      rx="4"
      fill="currentColor"
    />
  </svg>
);
