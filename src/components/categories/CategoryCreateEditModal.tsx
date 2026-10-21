import { CommonModels } from "@/data/common/common.models";

import { CreateCategoryForm } from "./CreateCategoryForm";

interface CategoryCreateEditModalProps {
  open: boolean;
  category?: CommonModels.CategoryResponseDto;
  otherCategoryOptions?: CommonModels.CategoryResponseDto[];
  onClose: (category?: CommonModels.CategoryResponseDto) => void;
}

export function CategoryCreateEditModal({
  open,
  category,
  otherCategoryOptions,
  onClose,
}: CategoryCreateEditModalProps) {
  return (
    <CreateCategoryForm
      open={open}
      mode={category ? "edit" : "create"}
      initialCategory={category}
      otherCategoryOptions={otherCategoryOptions}
      onClose={onClose}
    />
  );
}
