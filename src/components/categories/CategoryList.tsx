import { Card, CardContent } from "@mui/material";

import { CategoriesModels } from "@/data/categories/categories.models";
import { Typography } from "@/components/ui/text/Typography/Typography";

interface IProps {
  categories: CategoriesModels.CategoryResponseDto[];
}

export const CategoryList = ({ categories }: IProps) => {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <Typography size="body-paragraph-lg">No categories found</Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardContent>
            <Typography size="h6" className="mb-2">
              {category.name}
            </Typography>
            <Typography size="body-paragraph-s" className="mb-1 text-gray-600">
              Discipline: {category.discipline}
            </Typography>
            <Typography size="body-paragraph-s" className="mb-1 text-gray-600">
              Gender: {category.gender.join(", ")}
            </Typography>
            <Typography size="body-paragraph-s" className="mb-1 text-gray-600">
              Age: {category.ageMin} - {category.ageMax}
            </Typography>
            {category.weightMin && category.weightMax && (
              <Typography size="body-paragraph-s" className="mb-1 text-gray-600">
                Weight: {category.weightMin} - {category.weightMax} kg
              </Typography>
            )}
            <Typography size="body-paragraph-s" className="text-gray-600">
              Belt: {category.beltMin.replace(/_/g, " ")} - {category.beltMax.replace(/_/g, " ")}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
