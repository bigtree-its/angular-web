export const environment = {
  production: true,

  PRODUCT_SERVICE_URL: window["env"]["productServiceUrl"] || "http://localhost:8081",
  REVIEW_SERVICE_URL: window["env"]["reviewServiceUrl"] || "http://localhost:8081",


  ACCOUNT_SERVICE_URL: window["env"]["userServiceUrl"] || "http://localhost:8080",
  ORDER_SERVICE_URL: window["env"]["orderServiceUrl"] || "http://localhost:8082",
  CHANGE_PASSWORD: window["env"]["userServiceUrl"] + '/auth/change-password',
  FORGOT_PASSWORD: window["env"]["userServiceUrl"] + '/auth/forgot-password',
  RESET_PASSWORD: window["env"]["userServiceUrl"] + '/auth/reset-password',

  debug: window["env"]["debug"] || false,

  /** Paths */
   AUTH_LOGIN_PATH: '/auth/login',
   AUTH_REGISTER_PATH: '/auth/register',
   USERS: '/users',
   ORDERS: '/orders',
   BASKETS: '/baskets'
};
