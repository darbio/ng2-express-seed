import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ConfigService {

  public config: ClientConfig;

  constructor(private http: Http) { }

  load() {
    return new Promise((resolve, reject) => {
      this.http
        .get('/api/v1/config')
        .map((res) => res.json())
        .catch((error: any):any => {
            reject(false);
            return Observable.throw(error.json().error || 'Server error');
        })
        .subscribe((config: ClientConfig) => {
          this.config = config;
          resolve();
        });
    });
  }
}

export interface ClientConfig {
  client_id: string
  okta_server_url: string
}
