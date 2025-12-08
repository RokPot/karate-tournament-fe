import Button from "@mui/material/Button";
import { PaginationState, Table } from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import { Fragment } from "react";

import { Typography } from "@/components/ui/text/Typography/Typography";

export const Pagination = ({ pagination, table }: { pagination: PaginationState; table: Table<any> }) => {
  const { pageIndex } = pagination;
  const pageCount = table.getPageCount();

  const getVisiblePages = () => {
    if (!pageCount) {
      return [];
    }
    if (pageCount <= 4) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    const pages = [];
    pages.push(0);

    if (pageIndex <= 2) {
      pages.push(1, 2);
      if (pageIndex === 2) {
        pages.push(3);
      }
    } else if (pageIndex >= pageCount - 2) {
      pages.push(pageCount - 3, pageCount - 2, pageCount - 1);
    } else if (pageIndex === pageCount - 3) {
      pages.push(pageIndex - 1, pageIndex, pageIndex + 1);
    } else {
      pages.push(pageIndex - 1, pageIndex, pageIndex + 1);
    }

    if (!pages.includes(pageCount - 1)) {
      pages.push(pageCount - 1);
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-2 flex w-full flex-row items-center justify-center p-4">
      {visiblePages.map((pageNum, index) => {
        const showEllipsis = index > 0 && pageNum - visiblePages[index - 1] > 1;

        return (
          <Fragment key={pageNum}>
            {showEllipsis && (
              <Button
                key={`ellipsis-${pageNum}`}
                className="border-secondary-300 h-12 w-12 border bg-neutral-500"
                disabled
              >
                <Typography size="body-paragraph-xs" variant="prominent-2" className="text-white">
                  ...
                </Typography>
              </Button>
            )}
            <Button
              key={pageNum}
              className={cx(
                "border-elevation-outline-1 bg-elevation-surface-1 h-12 w-12 border outline-hidden! focus-visible:outline-hidden!",
                pageIndex === pageNum && "bg-elevation-surface-2",
              )}
              onClick={() => {
                table.setPageIndex(pageNum);
              }}
            >
              <Typography size="body-paragraph-xs" variant="prominent-2" className="text-white">
                {pageNum + 1}
              </Typography>
            </Button>
          </Fragment>
        );
      })}
    </div>
  );
};
