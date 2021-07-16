import React from "react";
import ReactTooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";

interface IProps {
  id: string;
  tooltipPlacement?:
    | "auto-start"
    | "auto"
    | "auto-end"
    | "top-start"
    | "top"
    | "top-end"
    | "right-start"
    | "right"
    | "right-end"
    | "bottom-end"
    | "bottom"
    | "bottom-start"
    | "left-end"
    | "left"
    | "left-start";
  children: JSX.Element;
  tooltipContent?: string | number | JSX.Element | null | false;
}

export const Tooltip: React.FC<IProps> = ({
  children,
  id,
  tooltipPlacement,
  tooltipContent,
}) => {
  return !!tooltipContent ? (
    <OverlayTrigger
      delay={{ hide: 450, show: 300 }}
      placement={tooltipPlacement}
      overlay={(props) => (
        <StyledReactTooltip id={id} {...props}>
          {tooltipContent}
        </StyledReactTooltip>
      )}
    >
      {children}
    </OverlayTrigger>
  ) : (
    <>{children}</>
  );
};

const StyledReactTooltip = styled(ReactTooltip)`
  .tooltip-inner {
    text-align: start;
    background: #f2efe5;
    box-shadow: 0px 1px 5px rgba(104, 104, 104, 0.1);
    border-radius: 6px;
    color: #333333;
    min-height: 30px;
  }

  .arrow::before,
  .bs-tooltip-bottom .arrow::before {
    display: none;
  }
`;
