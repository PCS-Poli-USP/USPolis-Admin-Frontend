import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import Crawl from 'models/database/crawler.model';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class CrawlerService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/crawl`);
  }

  crawl(data: Crawl): Promise<AxiosResponse<any>> {
    return this.http.post('', data);
  }
}
