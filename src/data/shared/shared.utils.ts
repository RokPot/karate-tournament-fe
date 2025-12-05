import { SharedModels } from "@/data/shared/shared.models";

export namespace SharedUtils {
  export const getNextPageParam = (page: SharedModels.PageableDto) => {
    const { pagination } = page.meta;
    if (pagination.current_page < pagination.total_pages) {
      return pagination.next_page;
    }
    return null;
  };
}
