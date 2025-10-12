import { googleAuth, signInUser, signOutUser, signUpUser } from "@/api/auth";
import { SignInFormData } from "@/components/auth/signin-form";
import { SignUpFormData } from "@/components/auth/signup-form";
import { PlanName } from "@/constants/pricing";
import { queryClient } from "@/main";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AuthState {
  isSubmitting: boolean;
  isOtpVerified: boolean;
  isAuthed: boolean;
  error: string | null;
  accessToken: string | null;

  markVerified: (token: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<{ message: string }>;
  signin: (
    credentials: SignInFormData,
  ) => Promise<{ twoFactorEnabled: boolean }>;
  signup: (credentials: SignUpFormData & { plan?: PlanName }) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
}

const refetchUser = () => {
  queryClient.invalidateQueries({ queryKey: ["user"] });
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isSubmitting: false,
        isOtpVerified: false,
        isAuthed: false,
        error: null,
        accessToken: null,

        setAccessToken: (token: string | null) => set({ accessToken: token }),

        markVerified: async (token) => {
          set({
            isOtpVerified: true,
            isAuthed: true,
            accessToken: token,
          });

          refetchUser();
        },

        googleLogin: async (idToken: string) => {
          set({ isSubmitting: true, error: null });
          try {
            const response = await googleAuth(idToken);
            const { accessToken } = response.data;

            set({
              isAuthed: true,
              isOtpVerified: true,
              accessToken: accessToken,
            });
            refetchUser();
            return { message: response.message };
          } catch (err) {
            set({
              error: "Google sign-in failed",
              isAuthed: false,
              isOtpVerified: false,
              accessToken: null,
            });
            throw err;
          } finally {
            set({ isSubmitting: false });
          }
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
                accessToken,
              });
              refetchUser();
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
            isAuthed: false,
            error: null,
            isSubmitting: true,
            accessToken: null,
            isOtpVerified: false,
          });
          queryClient.removeQueries({ queryKey: ["user"] });
          try {
            await signOutUser();
          } catch (err) {
            console.error("logging out on client.");
            throw err;
          } finally {
            set({ isSubmitting: false });
          }
        },
      }),
      {
        name: "auth-storage",
      },
    ),
    { name: "auth-store" },
  ),
);
