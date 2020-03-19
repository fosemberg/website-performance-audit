import {FetchOnFinishConfig} from "../../config/types";
import axios from "axios";

export const fetchOnFinishIfNeed = (params, fetchOnFinishConfig?: FetchOnFinishConfig) => {
  if (fetchOnFinishConfig && fetchOnFinishConfig.isFetch) {
    const {
      url,
      isAddParams,
      description = '',
    } = fetchOnFinishConfig;
    console.info(`Start fetch on finish to url: ${url} ${description}`);
    axios.get(url, {
      params: isAddParams ? params : {}
    })
  }
};
