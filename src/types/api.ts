export interface PaginationInfo {
  cursor: string | null;
  hasMore: boolean;
  total: number | null;
}

export interface ApiResponse<T> {
  status: "ok" | "error";
  data: T | null;
  errorCode: string | null;
  message: string | null;
  pagination: PaginationInfo | null;
}
