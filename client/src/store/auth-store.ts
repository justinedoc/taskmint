import { signInUser, signOutUser, signUpUser } from "@/api/auth";
import { SignInFormData } from "@/components/auth/signin-form";
import { SignUpFormData } from "@/components/auth/signup-form";
import { PlanName } from "@/constants/pricing";
import { getCurrentUser } from "@/data/get-current-user";
import { User } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isOtpVerified: boolean;
  isAuthed: boolean;
  error: string | null;
  accessToken: string | null;

  checkAuth: () => Promise<void>;
  markVerified: (token: string) => Promise<void>;
  signin: (
    credentials: SignInFormData,
  ) => Promise<{ twoFactorEnabled: boolean }>;
  signup: (credentials: SignUpFormData & { plan?: PlanName }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: true,
        isSubmitting: false,
        isOtpVerified: false,
        isAuthed: false,
        error: null,
        accessToken: null,

        setAccessToken: (token: string | null) => set({ accessToken: token }),

        checkAuth: async () => {
          set({ isLoading: true, error: null });
          try {
            const userData = await getCurrentUser();
            set({
              user: userData.data,
              isAuthed: true,
              isLoading: false,

              isOtpVerified: true,
            });
          } catch (err) {
            console.error("Error while checking auth: ", err);
            set({ isAuthed: false, isOtpVerified: false });
          } finally {
            set({ isLoading: false });
          }
        },

        markVerified: async (token) => {
          set({
            isOtpVerified: true,
            isAuthed: true,
            accessToken: token,
          });

          await get().checkAuth();
        },

        signin: async (credentials) => {
          set({ isSubmitting: true, error: null, isOtpVerified: false });
          try {
            const response = await signInUser(credentials);
            const { accessToken, twoFactorEnabled } = response.data;

            set({ isAuthed: true, isOtpVerified: false, accessToken: null });

            if (!twoFactorEnabled) {
              set({
                isOtpVerified: true,
                accessToken: accessToken,
              });
              await get().checkAuth();
            }

            return { twoFactorEnabled };
          } catch (err) {
            set({
              error: "Login failed",
              isAuthed: false,
              isOtpVerified: false,
              accessToken: null,
            });
            throw err;
          } finally {
            set({ isSubmitting: false });
          }
        },

        signup: async (credentials) => {
          set({ isSubmitting: true, error: null, isOtpVerified: false });
          try {
            await signUpUser(credentials);

            set({
              isAuthed: true,
              isOtpVerified: false,
              accessToken: null,
            });
          } catch (err) {
            set({
              error: "Signup failed",
              isAuthed: false,
              isOtpVerified: false,
              accessToken: null,
            });
            throw err;
          } finally {
            set({ isSubmitting: false });
          }
        },

        logout: async () => {
          set({
            user: null,
            isAuthed: false,
            error: null,
            isLoading: true,
            accessToken: null,
            isOtpVerified: false,
          });
          try {
            await signOutUser();
          } catch (err) {
            console.error("logging out on client.");
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        setUser: (user) => {
          set({
            user,
            isAuthed: !!user,
            isLoading: false,
            isSubmitting: false,
          });
        },
      }),
      {
        name: "auth-storage",
      },
    ),
    { name: "auth-store" },
  ),
);
