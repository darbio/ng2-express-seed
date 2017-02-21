export class Config {
  okta_server_url: string = process.env.OKTA_SERVER_URL;
  client_id: string = process.env.AUTH_CLIENT_ID;
  client_secret: string = process.env.AUTH_CLIENT_SECRET;
}
