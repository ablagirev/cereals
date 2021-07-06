import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Toast } from "../uikit/Toast";

interface INewPushContext {
  text: string;
  type?: string;
}

type IPushContext = {
  textList: INewPushContext[];
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

  const updatePushContext = (newContext: INewPushContext) => {
    const { text, type } = newContext;
    setPushContext((prevContext) => {
      const { textList } = prevContext;
      return {
        textList: [...textList, { text, type }],
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
          {pushContext?.textList?.map(({ text, type }, idx) => {
            return <Toast key={`${idx}-${text}`} text={text} type={type} />;
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
  z-index: 9999;
`;
