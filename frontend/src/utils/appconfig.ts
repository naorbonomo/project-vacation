// frontend/src/utils/appconfig.ts


const APP_CONFIG = {
    FRONTEND_PORT: 5000,
    API_BASE_URL: '', // Placeholder
    REACT_APP_S3_BUCKET_NAME: 'project-vacation', // Replace with your S3 bucket name
    REACT_APP_S3_BUCKET_REGION: 'us-east-1', // Replace with your S3 bucket region
    REACT_APP_S3_BUCKET_URL: 'https://project-vacation.s3.amazonaws.com/', // Replace with your S3 bucket URL
    REACT_APP_BACKEND_URL: 'http://98.80.12.122', // Replace with your backend URL
};

APP_CONFIG.API_BASE_URL = `${APP_CONFIG.REACT_APP_BACKEND_URL}:${APP_CONFIG.FRONTEND_PORT}`;

export default APP_CONFIG;