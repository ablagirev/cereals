import { useQuery } from "react-query";
import { daylesfordService } from "../services";
import { IOffer } from "../services/models";

const OFFER_LIST_DATA_QUERY_KEY = "OFFER_LIST_DATA_QUERY_KEY";
const OFFER__DATA_QUERY_KEY = "OFFER__DATA_QUERY_KEY";
const OFFER_EDIT_DATA_QUERY_KEY = "OFFER_EDIT_DATA_QUERY_KEY";
const OFFER_CREATE_DATA_QUERY_KEY = "OFFER_CREATE_DATA_QUERY_KEY";

export const useOffers = () => {
  const result = useQuery(
    OFFER_LIST_DATA_QUERY_KEY,
    () => daylesfordService.getOfferList(),
    {
      enabled: true,
      retry: true,
    }
  );

  return result;
};

export const useOffer = (id: string) => {
  const result = useQuery<IOffer>(
    [OFFER__DATA_QUERY_KEY, id],
    () => daylesfordService.getOffer(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return result;
};

export const useOfferEdit = (request: any) => {
  const result = useQuery(
    [OFFER_EDIT_DATA_QUERY_KEY],
    () => daylesfordService.editOffer(request),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
    }
  );

  return result;
};

export const useOfferCreate = (request: any) => {
  const result = useQuery(
    [OFFER_CREATE_DATA_QUERY_KEY],
    () => daylesfordService.createOffer(request),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
    }
  );

  return result;
};
