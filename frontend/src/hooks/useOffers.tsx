import { useQuery } from "react-query";
import { daylesfordService } from "../services";

const OFFER_LIST_DATA_QUERY_KEY = "OFFER_LIST_DATA_QUERY_KEY";

export const useOffers = () => {
  const result = useQuery(
    OFFER_LIST_DATA_QUERY_KEY,
    () => daylesfordService.getOfferList(),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return result;
};
