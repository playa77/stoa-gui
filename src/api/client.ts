import ky from "ky";
import { invoke } from "@tauri-apps/api/core";
import { ApiResponse } from "../types";

let apiToken: string | null = null;

/**
 * Initialize the API token from Tauri IPC.
 * This should be called during app startup.
 */
export async function initApiToken() {
  try {
    apiToken = await invoke<string>("read_api_token");
  } catch (error) {
    console.error("Failed to initialize API token:", error);
    apiToken = null;
  }
}

const client = ky.create({
  prefixUrl: "http://localhost:8420/api/v1",
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        if (apiToken) {
          request.headers.set("Authorization", `Bearer ${apiToken}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          // Emit auth_failed event to connection store (to be implemented in M2)
          window.dispatchEvent(new CustomEvent("connection:auth_failed"));
        }
      },
    ],
  },
});

export const api = {
  get: <T>(url: string, searchParams?: any) =>
    client.get(url, { searchParams }).json<ApiResponse<T>>(),

  post: <T>(url: string, json?: unknown) =>
    client.post(url, { json }).json<ApiResponse<T>>(),

  patch: <T>(url: string, json?: unknown) =>
    client.patch(url, { json }).json<ApiResponse<T>>(),

  delete: <T>(url: string) =>
    client.delete(url).json<ApiResponse<T>>(),
};

export default api;
