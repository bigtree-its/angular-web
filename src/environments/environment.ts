// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  /** Products */
  PRODUCT_SERVICE_URL: 'http://localhost:8081/',
  REVIEW_SERVICE_URL: 'http://localhost:8081/',
  
  /** Accounts */
  ACCOUNT_SERVICE_URL: 'http://localhost:8080',
  AUTH_LOGIN_PATH: '/auth/login',
  AUTH_REGISTER_PATH: '/auth/register',
  CHANGE_PASSWORD: 'http://localhost:8080/auth/change-password',
  FORGOT_PASSWORD: 'http://localhost:8080/auth/forgot-password',
  RESET_PASSWORD: 'http://localhost:8080/auth/reset-password',
  USERS: '/users',

  /** Orders */
  ORDER_SERVICE_URL: 'http://localhost:8082',
  ORDERS: '/orders',
  BASKETS: '/baskets'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
