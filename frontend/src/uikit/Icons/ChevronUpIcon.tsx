import React from "react";

interface IProps {
  size?: string;
}

/**
 * Иконка "Стрелка вверх".
 */
export const ChevronUpIcon = ({ size }: IProps) => (
  <svg
    width={size ? size : "7"}
    height={size ? size : "5"}
    viewBox="0 0 7 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4L3.5 1L1 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
