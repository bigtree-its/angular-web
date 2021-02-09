(function (window) {
    window.env = window.env || {};

    // Environment variables
    window["env"]["productServiceUrl"] = "${PRODUCTS_URL}";
    window["env"]["reviewServiceUrl"] = "${REVIEWS_URL}";
    window["env"]["userServiceUrl"] = "${USERS_URL}";
    window["env"]["orderServiceUrl"] = "${ORDERS_URL}";
    window["env"]["debug"] = "${DEBUG}";
    
    /** GetAddressIO variables */
    window["env"]["apiKeyGetAddressIO"] = "${API_KEY_GETADDRESS_IO}";
    window["env"]["postcodeLookupServiceUrl"] = "${POSTCODELOOKUP_SERVICE_URL}";
    window["env"]["distanceServiceUrl"] = "${DISTANCE_SERVICE_URL}";
    window["env"]["originPostcode"]  = "${ORIGIN_POSTCODE}";
})(this);