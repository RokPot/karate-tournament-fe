import { AuthContext } from "@/data/auth/auth.context";
import { CommonModels } from "@/data/common/common.models";

export const useAuthUser = (): CommonModels.UserResponseDto | undefined => {
  const { user: authUser } = AuthContext.useAuth();
  return authUser;
};
