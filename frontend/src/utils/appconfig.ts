// src/utils/appconfig.ts

const APP_CONFIG = {
    FRONTEND_PORT: 5000,
    API_BASE_URL: '', // Placeholder
};

APP_CONFIG.API_BASE_URL = `http://localhost:${APP_CONFIG.FRONTEND_PORT}`;

export default APP_CONFIG;