import { useCallback, useState } from "react";

export const usePaginationState = (initialPageSize = 10) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const calculateTotalPages = (
    totalRecords: number | undefined,
    metadata?: {
      totalPages?: number;
      lastPage?: number;
      limit?: number;
    },
  ) => {
    if (!metadata) return 1;

    return (
      metadata.totalPages ??
      metadata.lastPage ??
      (metadata.limit && totalRecords
        ? Math.ceil(totalRecords / metadata.limit)
        : 1)
    );
  };

  return {
    page,
    pageSize,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    calculateTotalPages,
  };
};
