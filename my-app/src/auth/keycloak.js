// /src/auth/keycloak.js

import Keycloak from "keycloak-js";

// Importa la variable aquí también
const redirectUrl = import.meta.env.VITE_APP_URL; 

const keycloak = new Keycloak({
    url: "https://keycloak.financialsoft.com.mx/",
    realm: "sistemaVehiculos",
    clientId: "FINANCIALSOFT", 
    
    // 🚀 AÑADIR AQUÍ: Se asegura que el objeto Keycloak tenga el valor correcto
    redirectUri: redirectUrl, 
});

export default keycloak;