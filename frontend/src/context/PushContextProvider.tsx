import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Toast } from "../uikit/Toast";

type IPushContext = {
  textList: string[];
};

// TODO: избавиться от any ниже в пуш контексте и использовать интерфейс
type TPushContextType = IPushContext & {
  setPushContext: (context: Partial<IPushContext>) => void;
};

export const PushContext = React.createContext<any>({});

/**
 * Поставщик общего контекста выбора заявок.
 */
export const PushContextProvider: React.FC = ({ children }) => {
  const [pushContext, setPushContext] = React.useState<IPushContext>({
    textList: [],
  });

  const updatePushContext = (newContext: { text: string }) => {
    const { text } = newContext;
    setPushContext((prevContext) => {
      const { textList } = prevContext;
      return {
        textList: [...textList, text],
      };
    });
  };

  return (
    <PushContext.Provider
      value={{
        ...pushContext,
        setPushContext: updatePushContext,
      }}
    >
      <ToastsWrapper>
        <Toasts>
          {pushContext?.textList?.map((text, idx) => {
            return <Toast key={`${idx}-${text}`} text={text} />;
          })}
        </Toasts>
      </ToastsWrapper>
      {children}
    </PushContext.Provider>
  );
};

const Toasts = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
`;

const ToastsWrapper = styled.div`
  position: relative;
`;
