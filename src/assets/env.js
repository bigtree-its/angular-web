(function (window) {
    window["env"] = window["env"] || {};

    // Environment variables
    window["env"]["productServiceUrl"] = "http://localhost:8081";
    window["env"]["reviewServiceUrl"] = "http://localhost:8081";
    window["env"]["userServiceUrl"] = "http://localhost:8080";
    window["env"]["orderServiceUrl"] = "http://localhost:8082";
    window["env"]["debug"] = true;
})(this);