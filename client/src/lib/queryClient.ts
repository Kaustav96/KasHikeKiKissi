import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
// export const getQueryFn: <T>(options: {
//   on401: UnauthorizedBehavior;
// }) => QueryFunction<T> =
// ({ on401: unauthorizedBehavior }) =>
// async ({ queryKey }) => {
//   const res = await fetch(queryKey.join("/") as string, {
//     credentials: "include",
//   });

//   if (unauthorizedBehavior === "returnNull" && res.status === 401) {
//     return null;
//   }

//   await throwIfResNotOk(res);
//   return await res.json();
// };
export const getQueryFn =
  <T>({ on401 }: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
    async ({ queryKey }) => {
      let url: string;

      // If queryKey is string
      if (typeof queryKey[0] === "string") {
        url = queryKey[0];
      } else {
        throw new Error("Invalid queryKey");
      }

      const res = await fetch(url, {
        credentials: "include",
      });

      if (on401 === "returnNull" && res.status === 401) {
        return null as T;
      }

      await throwIfResNotOk(res);

      return res.json();
    };
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
