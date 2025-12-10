import Vapi from '@vapi-ai/web';

// Initialize Vapi client with your API token
// Get your token from https://vapi.ai
export const vapi = new Vapi(process.env.VAPI_TOKEN || '');
