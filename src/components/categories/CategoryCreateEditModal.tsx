import { CommonModels } from "@/data/common/common.models";

import { CreateCategoryForm } from "./CreateCategoryForm";

interface CategoryCreateEditModalProps {
  open: boolean;
  category?: CommonModels.CategoryResponseDto;
  onClose: (category?: CommonModels.CategoryResponseDto) => void;
}

export function CategoryCreateEditModal({
  open,
  category,
  onClose,
}: CategoryCreateEditModalProps) {
  return (
    <CreateCategoryForm
      open={open}
      mode={category ? "edit" : "create"}
      initialCategory={category}
      onClose={onClose}
    />
  );
}
