import styled from "styled-components";

export const Color = styled.span.attrs(({ color }) => {
  return {
    "data-test-id": "color",
    style: {
      color,
      display: "flex",
      flexDirection: "column",
    },
  };
})``;
