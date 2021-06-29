import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html,
    body {
        height: 100%;
    }

    html {
        cursor: default;
        word-break: break-word;
    }
    body {
        margin: 0;
        background-color: #EFEBDE;
        font-family: Rubik;
        font-style: 400;
        font-weight: normal;
        font-size: 14px;
        color: #191919;
    }

    ol,
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }


`;