import { QueryClient } from '@tanstack/react-query';

export function createWebPlatformQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 60 * 1000,
      },
    },
  });
}
