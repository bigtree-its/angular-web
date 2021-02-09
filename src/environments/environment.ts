// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  PRODUCT_SERVICE_URL: window["env"]["productServiceUrl"] || "http://localhost:8081/products/v1",
  REVIEW_SERVICE_URL: window["env"]["reviewServiceUrl"] || "http://localhost:8081/reviews/v1",
  

  ACCOUNT_SERVICE_URL: window["env"]["userServiceUrl"] || "http://localhost:8080/users/v1",
  ORDER_SERVICE_URL: window["env"]["orderServiceUrl"] || "http://localhost:8082/orders/v1",
  CHANGE_PASSWORD: window["env"]["userServiceUrl"] + '/auth/change-password',
  FORGOT_PASSWORD: window["env"]["userServiceUrl"] + '/auth/forgot-password',
  RESET_PASSWORD: window["env"]["userServiceUrl"] + '/auth/reset-password',

  debug: window["env"]["debug"] || false,

  /** Paths */
   AUTH_LOGIN_PATH: '/auth/login',
   AUTH_REGISTER_PATH: '/auth/register',
   USERS: '/users',
   ORDERS: '/orders',
   BASKETS: '/baskets',

   /** GetAddress.io */
   API_KEY_GETADDRESS_IO: window["env"]["apiKeyGetAddressIO"],
   POSTCODELOOKUP_SERVICE_URL: window["env"]["postcodeLookupServiceUrl"] || "https://api.getaddress.io/find",
   DISTANCE_SERVICE_URL: window["env"]["distanceServiceUrl"] || "https://api.getAddress.io/distance",
   ORIGIN_POSTCODE: window["env"]["originPostcode"],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
