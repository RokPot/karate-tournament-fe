import { Loader } from "@/components/ui/status/Loader/Loader";

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center p-10 text-secondary-300">
      <Loader size="l" />
    </div>
  );
};
