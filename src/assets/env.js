(function (window) {
    window["env"] = window["env"] || {};

    // SERVICE URLS variables
    window["env"]["productServiceUrl"] = "http://localhost:8081/products/v1";
    window["env"]["reviewServiceUrl"] = "http://localhost:8081/reviews/v1";
    window["env"]["userServiceUrl"] = "http://localhost:8080/users/v1";
    window["env"]["orderServiceUrl"] = "http://localhost:8085/openchef/v1/orders";
    window["env"]["basketServiceUrl"] = "http://localhost:8085/openchef/v1/orders/baskets";
    window["env"]["adServiceUrl"] = "http://localhost:8083";

    window["env"]["apiKeyGetAddressIO"] = "VoEYLOWRyECPuAIwDnocAQ30109";
    window["env"]["postcodeLookupServiceUrl"] = "https://api.getaddress.io/find";
    window["env"]["distanceServiceUrl"] = "https://api.getaddress.io/distance";
    window["env"]["debug"] = true;
    window["env"]["originPostcode"] = "G775SF";
    
    /** RapidAPI variables */
    window["env"]["X_RapidAPI_Url"] = "https://samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com/ByPostcode/json";
    window["env"]["X_RapidAPI_Key"] = "d8bb8d6322msh47d26a431dd15ddp10799bjsnc6530e32a72c";
    window["env"]["PostCode4U_Key"] = "NRU3-OHKW-J8L2-38PX";
    window["env"]["X_RapidAPI_Username"]  = "guest";
    window["env"]["X_RapidAPI_Host"]  = "samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com";
})(this);