import React, { useEffect, useState } from "react";

import ReactToast from "react-bootstrap/Toast";
import styled from "styled-components";
import { theme } from "../../theme";
import { Typography } from "../Text";

interface IProps {
  text: string;
  type?: string;
}

export const Toast: React.FC<IProps> = ({ text, type = "notification" }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    setShow(!!text);
  }, [text]);

  return (
    <StyledReactToast
      delay={3000}
      autohide
      onClose={handleClose}
      show={show}
      type={type}
    >
      {type === "error" && (
        <StyledHeader closeButton={false}>
          <Typography bold color={theme.palette.common.colors.red}>
            Ошибка
          </Typography>
        </StyledHeader>
      )}
      <StyledBody>{text}</StyledBody>
    </StyledReactToast>
  );
};

const StyledHeader = styled(ReactToast.Header)`
  border-radius: 6px;
  background-color: #f2efe5;
  text-align: center;
  padding: 8px;
`;

const StyledBody = styled(ReactToast.Body)`
  min-width: 240px;
  background-color: #f2efe5;
  border-radius: 6px;
  text-align: center;
  padding: 8px;
`;

const StyledReactToast = styled(ReactToast)`
  color: ${({ type }) => type === "error" && theme.palette.common.colors.red};
  border-color: ${({ type }) =>
    type === "error" && theme.palette.common.colors.red};
  border-radius: 6px;
  background-color: #f2efe5;
`;
