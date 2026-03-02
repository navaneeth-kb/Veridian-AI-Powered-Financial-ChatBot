/**
 * API Configuration
 * 
 * Centralized API configuration with environment variable support
 */

// Get API URL from environment variable or use default
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API timeout in milliseconds
export const API_TIMEOUT = 60000; // 30 seconds

// API endpoints
export const API_ENDPOINTS = {
  CHAT: '/ask',
  HEALTH: '/',
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
