(function (window) {
    window.env = window.env || {};

    // Environment variables
    window["env"]["productServiceUrl"] = "${PRODUCTS_URL}";
    window["env"]["reviewServiceUrl"] = "${REVIEWS_URL}";
    window["env"]["userServiceUrl"] = "${USERS_URL}";
    window["env"]["orderServiceUrl"] = "${ORDERS_URL}";
    window["env"]["debug"] = "${DEBUG}";
})(this);