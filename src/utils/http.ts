const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Config = RequestInit & { params?: Record<string, string | number> };

export interface HttpResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

const baseHttp = async <T = any>(url: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: any, config?: Config): Promise<T> => {
  try {
    let requestUrl = apiUrl + url;

    // Handle query parameters (params)
    if (method === "GET" && config?.params) {
      const queryParams = new URLSearchParams();
      for (const key in config.params) {
        if (config.params.hasOwnProperty(key)) {
          queryParams.append(key, String(config.params[key]));
        }
      }
      requestUrl += `?${queryParams.toString()}`;
    }

    const isFormData = body instanceof FormData;
    const headers = isFormData ? config?.headers || {} : { "Content-Type": "application/json", ...(config?.headers || {}) };

    const response = await fetch(requestUrl, {
      ...config,
      method,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw errorResponse;
    }

    return response.json();
  } catch (error: any) {
    throw error;
  }
};

export const http = {
  get: async <T = any>(url: string, config?: Config): Promise<HttpResponse<T>> => baseHttp(url, "GET", undefined, config),

  post: async <T = any>(url: string, body?: any, config?: Config): Promise<HttpResponse<T>> => baseHttp(url, "POST", body, config),

  put: async <T = any>(url: string, body?: any, config?: Config): Promise<HttpResponse<T>> => baseHttp(url, "PUT", body, config),

  delete: async <T = any>(url: string, config?: Config): Promise<HttpResponse<T>> => baseHttp(url, "DELETE", undefined, config),
};
