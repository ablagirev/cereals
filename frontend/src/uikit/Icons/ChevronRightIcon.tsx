import React from "react";

/**
 * Свойства компонента.
 *
 * @prop {string} [className] Имя класса.
 */
interface IProps {
  className?: string;
}

/**
 * Иконка, изображающая переход вправо.
 */
export const ChevronRightIcon: React.FC<IProps> = ({ className }) => (
  <svg
    width="7"
    height="10"
    viewBox="0 0 7 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1.41421L1.41421 0L6.12132 4.70711L1.41421 9.41421L0 8L3.29289 4.70711L0 1.41421Z"
      fill="currentColor"
    />
  </svg>
);
