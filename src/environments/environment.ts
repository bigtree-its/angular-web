// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  CURRENCY: "GBP",
  CURRENCY_SYMBOL: "£",

  PRODUCT_SERVICE_URL: window["env"]["productServiceUrl"] || "http://localhost:8080/products/v1",
  REVIEW_SERVICE_URL: window["env"]["reviewServiceUrl"] || "http://localhost:8080/reviews/v1",
  AD_SERVICE_URL: window["env"]["adServiceUrl"] || "http://localhost:8083",
  OPENCHEF_ORDERS_HOST: window["env"]["openChefServiceUrl"] || "http://localhost:8085",
  
  ORDER_SERVICE_URL: window["env"]["orderServiceUrl"] || "http://localhost:8085/openchef/v1/orders",
  BASKET_SERVICE_URL: window["env"]["basketServiceUrl"] || "http://localhost:8085/openchef/v1/orders/baskets",

  ACCOUNT_SERVICE_URL: window["env"]["customerServiceUrl"] || "http://localhost:8081/r2c/v1/users",
  RESET_PASSWORD_INITIATE: window["env"]["customerServiceUrl"] + '/password-reset/initiate',
  RESET_PASSWORD_SUBMIT: window["env"]["customerServiceUrl"] + '/password-reset/submit',
  CHANGE_PASSWORD: window["env"]["customerServiceUrl"] + '/password-reset/change',

  debug: window["env"]["debug"] || false,

  /** Base Paths */
   AUTH_LOGIN_PATH: '/login',
   AUTH_REGISTER_PATH: '/signup',
   AUTH_SESSIONS_PATH: '/sessions',
   AUTH_LOGOUT_PATH: '/logout',
   USERS: '/users',
   ORDERS: '/orders',
   CREATE_PAYMENT_INTENT: '/openchef/v1/create-payment-intent',
   BASKETS: '/baskets',
   ADS_BASEPATH: '/ads/v1',

   /** URI */
   PROPERTIES_URI: '/properties',
   LOCALCHEFS_URI: '/localchefs',
   LOCALAREA_URI: '/localarea',
   CUISINES_URI: '/cuisines',
   FOODS_URI: '/foods',
   CALENDARS_URI: '/calendars', //http://localhost:8083/ads/v1/calendars?chef=721dc4e3-b87c-4da3-8ff5-8c6b2907614e&thisweek=true
   OPENCHEF_ORDERS_URI: '/openchef/v1/orders',
   PROPERTY_TYPES_URI: '/property-types',

   /** GetAddress.io */
   API_KEY_GETADDRESS_IO: window["env"]["apiKeyGetAddressIO"],
   POSTCODELOOKUP_SERVICE_URL: window["env"]["postcodeLookupServiceUrl"] || "https://api.getaddress.io/find",
   DISTANCE_SERVICE_URL: window["env"]["distanceServiceUrl"] || "https://api.getAddress.io/distance",
   ORIGIN_POSTCODE: window["env"]["originPostcode"],

   /** RapidAPI  */
   X_RapidAPI_Url: window["env"]["X_RapidAPI_Url"] || "https://samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com/ByPostcode/json",
   X_RapidAPI_Host: window["env"]["X_RapidAPI_Host"] || "samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com",
   X_RapidAPI_Key: window["env"]["X_RapidAPI_Key"] || "249a5c6ab3mshce3cf38f2ca8130p195a93jsn3ad1c6002c20"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
