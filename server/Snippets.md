# Verify token with IDP

## Server side (client secret provided - must not be used client side)

let formData = new URLSearchParams();
formData.append('token', context.idToken);
formData.append('token_type_hint', 'id_token');
formData.append('client_id', oauthService.clientId);
//formData.append('client_secret', '');

let body = formData.toString();

return http.post("https://dev-460081.oktapreview.com/oauth2/v1/introspect", body,
  new RequestOptions(
    {
      headers: new Headers(
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      )
    }
  )
).toPromise();
