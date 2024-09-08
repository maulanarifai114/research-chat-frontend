// useHttpWithLoading.ts
import { useCallback } from "react";
import { Config, http, HttpResponse } from "@/utils/http";
import { useLoadingBar } from "./useLoadingBar";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { profileState } from "@/state/profile.state";
import { useSnackbar } from "./useSnackbar";

const useHttp = () => {
  const loadingBar = useLoadingBar();
  const router = useRouter();
  const [_, setProfile] = useRecoilState(profileState);
  const snackbar = useSnackbar();

  const withLoading = useCallback(
    async <T>(request: () => Promise<HttpResponse<T>>): Promise<HttpResponse<T>> => {
      loadingBar.start();
      try {
        const response = await request();
        loadingBar.complete();
        return response;
      } catch (error: any) {
        if (error.statusCode && error.statusCode === 401) router.push("/auth");
        setProfile(null);
        snackbar.start(error.message, "error");
        loadingBar.complete();
        throw error;
      }
    },
    [loadingBar.start, loadingBar.complete],
  );

  const get = useCallback(
    <T>(url: string, config?: Config) => {
      return withLoading(() => http.get<T>(url, config));
    },
    [withLoading],
  );

  const post = useCallback(
    <T>(url: string, body?: any, config?: Config) => {
      return withLoading(() => http.post<T>(url, body, config));
    },
    [withLoading],
  );

  const put = useCallback(
    <T>(url: string, body?: any, config?: Config) => {
      return withLoading(() => http.put<T>(url, body, config));
    },
    [withLoading],
  );

  const del = useCallback(
    <T>(url: string, config?: Config) => {
      return withLoading(() => http.delete<T>(url, config));
    },
    [withLoading],
  );

  return { get, post, put, delete: del };
};

export default useHttp;
