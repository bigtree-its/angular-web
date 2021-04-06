(function (window) {
    window.env = window.env || {};

    // Environment variables
    window["env"]["productServiceUrl"] = "${PRODUCTS_URL}";
    window["env"]["reviewServiceUrl"] = "${REVIEWS_URL}";
    window["env"]["userServiceUrl"] = "${USERS_URL}";
    window["env"]["orderServiceUrl"] = "${ORDERS_URL}";
    window["env"]["basketServiceUrl"] = "${BASKETS_URL}";
    window["env"]["debug"] = "${DEBUG}";
    
    /** GetAddressIO variables */
    window["env"]["apiKeyGetAddressIO"] = "${API_KEY_GETADDRESS_IO}";
    window["env"]["postcodeLookupServiceUrl"] = "${POSTCODELOOKUP_SERVICE_URL}";
    window["env"]["distanceServiceUrl"] = "${DISTANCE_SERVICE_URL}";
    window["env"]["originPostcode"]  = "${ORIGIN_POSTCODE}";

    /** RapidAPI variables */
    window["env"]["X_RapidAPI_Url"] = "${X_RAPIDAPI_URL}";
    window["env"]["X_RapidAPI_Key"] = "${X_RAPIDAPI_KEY}";
    window["env"]["PostCode4U_Key"] = "${POSTCODE4U_KEY}";
    window["env"]["X_RapidAPI_Username"]  = "${X_RAPIDAPI_USERNAME}";
    window["env"]["X_RapidAPI_Host"]  = "${X_RAPIDAPI_HOST}";


})(this);