export class Config {
  oidc_server_url: string = process.env.OIDC_SERVER_URL;
  client_id: string = process.env.AUTH_CLIENT_ID;
  client_secret: string = process.env.AUTH_CLIENT_SECRET;
  is_development: boolean = process.env.NODE_ENV == "development"
  redis_url: string = process.env.REDIS_URL;
}
