export class Config {
  okta_server_url: string = process.env.OKTA_SERVER_URL ||    "https://dev-460081.oktapreview.com";
  client_id: string = process.env.AUTH_CLIENT_ID ||           "kgkNF8ILGmkR8Cj8f1Iz";
  client_secret: string = process.env.AUTH_CLIENT_SECRET ||   "NOT SET HERE";
}
