/**
 * Chat Service
 * 
 * Handles all API communication with the backend chat service
 * Includes error handling, timeout management, and retry logic
 */

import type { ChatAPIResponse, HealthCheckResponse, ChatServiceError } from '../types/chat.types';
import { getApiUrl, API_ENDPOINTS, API_TIMEOUT } from './api.config';

/**
 * Custom error class for chat service errors
 */
class ChatAPIError extends Error implements ChatServiceError {
  code?: string;
  statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'ChatAPIError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Send a message to the AI financial advisor
 * @param message - User's financial query
 * @returns AI's response text
 * @throws ChatAPIError if the request fails
 */
export const sendMessage = async (message: string): Promise<string> => {
  // Validate input
  if (!message || message.trim().length === 0) {
    throw new ChatAPIError('Message cannot be empty', 'EMPTY_MESSAGE');
  }

  if (message.length > 5000) {
    throw new ChatAPIError('Message is too long (max 5000 characters)', 'MESSAGE_TOO_LONG');
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(getApiUrl(API_ENDPOINTS.CHAT), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.trim() }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const data: ChatAPIResponse = await response.json();

    // Handle API errors
    if (!response.ok) {
      const errorMessage = data.error?.message || 'Failed to get response from AI';
      throw new ChatAPIError(
        errorMessage,
        'API_ERROR',
        response.status
      );
    }

    // Validate response structure
    if (!data.success || !data.data?.reply) {
      throw new ChatAPIError(
        'Invalid response format from server',
        'INVALID_RESPONSE'
      );
    }

    return data.data.reply;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Debug logging
    console.error('ChatService error:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);

    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new ChatAPIError(
        'Request timeout - please check your connection and try again',
        'TIMEOUT'
      );
    }

    if (error instanceof ChatAPIError) {
      throw error;
    }

    // Handle network errors
    if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
      throw new ChatAPIError(
        'Unable to connect to the server. Please ensure the backend is running on http://localhost:3001',
        'NETWORK_ERROR'
      );
    }

    // Generic error
    throw new ChatAPIError(
      error.message || 'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  }
};

/**
 * Check the health status of the backend API
 * @returns true if the API is healthy, false otherwise
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(getApiUrl(API_ENDPOINTS.HEALTH), {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: HealthCheckResponse = await response.json();
    return data.success === true;

  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

/**
 * Retry a failed API call with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @returns Result of the function
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on validation errors
      if (error.code === 'EMPTY_MESSAGE' || error.code === 'MESSAGE_TOO_LONG') {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

// Export chatService object for convenience
export const chatService = {
  sendMessage,
  healthCheck,
  retryWithBackoff,
};

export default chatService;
