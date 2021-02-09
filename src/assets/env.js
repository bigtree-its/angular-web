(function (window) {
    window["env"] = window["env"] || {};

    // Environment variables
    window["env"]["productServiceUrl"] = "http://localhost:8081/products/v1";
    window["env"]["reviewServiceUrl"] = "http://localhost:8081/reviews/v1";
    window["env"]["userServiceUrl"] = "http://localhost:8080/users/v1";
    window["env"]["orderServiceUrl"] = "http://localhost:8082/orders/v1";
    window["env"]["apiKeyGetAddressIO"] = "VoEYLOWRyECPuAIwDnocAQ30109";
    window["env"]["postcodeLookupServiceUrl"] = "https://api.getaddress.io/find";
    window["env"]["distanceServiceUrl"] = "https://api.getaddress.io/distance";
    window["env"]["debug"] = true;
    window["env"]["originPostcode"] = "G775SF";
})(this);