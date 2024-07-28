import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AxiosResponse } from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class AppService {

  private readonly apiMarvelUrl = 'https://gateway.marvel.com/v1/public';
  private readonly publicKey = '173c373b359b7896874260f09e499bca';
  private readonly privateKey = '62353d6629eb82a3cab7c144930a2d018c22ab88';

  constructor(private readonly httpService: HttpService) {}

  async getComics(): Promise<any> {

    const ts = new Date().getTime().toString();
    const hash = crypto
      .createHash('md5')
      .update(ts + this.privateKey + this.publicKey)
      .digest('hex');
    console.log({hash})
    console.log({ts})
    try {
      const response: AxiosResponse<any> = await this.httpService.get(`${this.apiMarvelUrl}/comics`, {
        params: {
          ts: ts,
          apikey: this.publicKey,
          hash: hash,
          limit:6,
          format:'comic',
          formatType:'comic'
        },
      })
      .toPromise();
      console.log({response})

      return response.data;
    } catch (error) {
      console.log('error')
      throw new Error(`Error fetching comics: ${error.message}`);
    }
  }
}
