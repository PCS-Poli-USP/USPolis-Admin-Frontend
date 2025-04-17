import { AxiosResponse } from 'axios';
import Crawl from '../../../models/common/crawler.model';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useCrawlerService = () => {
  const PREFIX = '/crawl';
  const axios = useAxiosPrivate();

  const crawl = (data: Crawl): Promise<AxiosResponse<any>> => {
    return axios.post(PREFIX, data);
  };

  return { crawl };
};

export default useCrawlerService;
