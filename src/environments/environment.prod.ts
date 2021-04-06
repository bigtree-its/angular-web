export const environment = {
  production: true,

  PRODUCT_SERVICE_URL: window["env"]["productServiceUrl"],
  REVIEW_SERVICE_URL: window["env"]["reviewServiceUrl"],
  // POSTCODELOOKUP_SERVICE_URL: window["env"]["postcodeLookupServiceUrl"] || "https://api.getaddress.io/find/g775sf?expand=true&api-key=VoEYLOWRyECPuAIwDnocAQ30109",

  ACCOUNT_SERVICE_URL: window["env"]["userServiceUrl"],
  ORDER_SERVICE_URL: window["env"]["orderServiceUrl"],
  BASKET_SERVICE_URL: window["env"]["basketServiceUrl"],
  
  CHANGE_PASSWORD: window["env"]["userServiceUrl"] + '/auth/change-password',
  FORGOT_PASSWORD: window["env"]["userServiceUrl"] + '/auth/forgot-password',
  RESET_PASSWORD: window["env"]["userServiceUrl"] + '/auth/reset-password',

  debug: window["env"]["debug"] || false,

  // Paths
  // Paths always starts with prefix '/'

  AUTH_LOGIN_PATH: '/auth/login',
  AUTH_REGISTER_PATH: '/auth/register',
  USERS: '/users',
  ORDERS: '/orders',
  CREATE_PAYMENT_INTENT: '/create-payment-intent',
  BASKETS: '/baskets',

  /** GetAddress.io */
  API_KEY_GETADDRESS_IO: window["env"]["apiKeyGetAddressIO"],
  POSTCODELOOKUP_SERVICE_URL: window["env"]["postcodeLookupServiceUrl"],
  DISTANCE_SERVICE_URL: window["env"]["distanceServiceUrl"],
  ORIGIN_POSTCODE: window["env"]["originPostcode"],


  /** RapidAPI  */
  X_RapidAPI_Url: window["env"]["X_RapidAPI_Url"],
  X_RapidAPI_Key: window["env"]["X_RapidAPI_Key"],
  PostCode4U_Key: window["env"]["PostCode4U_Key"],
  X_RapidAPI_Username: window["env"]["X_RapidAPI_Username"],
  X_RapidAPI_Host: window["env"]["X_RapidAPI_Host"]
};
