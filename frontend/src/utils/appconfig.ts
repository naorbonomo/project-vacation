// src/utils/appconfig.ts

const APP_CONFIG = {
    FRONTEND_PORT: 5000,
    API_BASE_URL: '', // Placeholder
};

APP_CONFIG.API_BASE_URL = `http://98.80.12.122:${APP_CONFIG.FRONTEND_PORT}`;

export default APP_CONFIG;