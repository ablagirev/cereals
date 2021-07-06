import React from "react";
import { useQuery } from "react-query";
import { PushContext } from "../context";
import { daylesfordService } from "../services";
import { IOffer } from "../services/models";

const OFFER_LIST_DATA_QUERY_KEY = "OFFER_LIST_DATA_QUERY_KEY";
const OFFER__DATA_QUERY_KEY = "OFFER__DATA_QUERY_KEY";
const OFFER_EDIT_DATA_QUERY_KEY = "OFFER_EDIT_DATA_QUERY_KEY";
const OFFER_CREATE_DATA_QUERY_KEY = "OFFER_CREATE_DATA_QUERY_KEY";
const OFFER_DELETE_DATA_QUERY_KEY = "OFFER_DELETE_DATA_QUERY_KEY";

export const useOffers = () => {
  const pushContext = React.useContext(PushContext);
  const result = useQuery(
    OFFER_LIST_DATA_QUERY_KEY,
    () => daylesfordService.getOfferList(),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: true,
      onError: (e: any) =>
        pushContext.setPushContext({
          text: `${e.message}: список предложений`,
          type: "error",
        }),
    }
  );

  return result;
};

export const useOffer = (id: string) => {
  const pushContext = React.useContext(PushContext);
  const result = useQuery<IOffer>(
    [OFFER__DATA_QUERY_KEY, id],
    () => daylesfordService.getOffer(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: false,
      onError: (e: any) =>
        pushContext.setPushContext({
          text: `${e.message}: данные предложения`,
          type: "error",
        }),
    }
  );

  return result;
};

export const useOfferEdit = (request: any) => {
  const pushContext = React.useContext(PushContext);
  const result = useQuery(
    [OFFER_EDIT_DATA_QUERY_KEY],
    () => daylesfordService.editOffer(request),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
      onError: (e: any) =>
        pushContext.setPushContext({
          text: `${e.message}: редактирование предложения`,
          type: "error",
        }),
    }
  );

  return result;
};

export const useOfferCreate = (request: any) => {
  const pushContext = React.useContext(PushContext);
  const result = useQuery(
    [OFFER_CREATE_DATA_QUERY_KEY],
    () => daylesfordService.createOffer(request),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
      onError: (e: any) =>
        pushContext.setPushContext({
          text: `${e.message}: создание предложения`,
          type: "error",
        }),
    }
  );

  return result;
};

export const useOfferDelete = (id: string) => {
  const pushContext = React.useContext(PushContext);
  const result = useQuery(
    [OFFER_DELETE_DATA_QUERY_KEY],
    () => daylesfordService.deleteOffer(id),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
      onError: (e: any) =>
        pushContext.setPushContext({
          text: `${e.message}: удаление предложения`,
          type: "error",
        }),
    }
  );

  return result;
};
