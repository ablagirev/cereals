import React, { useEffect, useState } from "react";

import ReactToast from "react-bootstrap/Toast";
import styled from "styled-components";

interface IProps {
  text: string;
}

export const Toast: React.FC<IProps> = ({ text }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    setShow(!!text);
  }, [text]);

  return (
    <StyledReactToast delay={3000} autohide onClose={handleClose} show={show}>
      <StyledBody>{text}</StyledBody>
    </StyledReactToast>
  );
};

const StyledBody = styled(ReactToast.Body)`
  min-width: 240px;
  background-color: #f2efe5;
  border-radius: 6px;
  text-align: center;
`;

const StyledReactToast = styled(ReactToast)`
  border-radius: 6px;
`;
