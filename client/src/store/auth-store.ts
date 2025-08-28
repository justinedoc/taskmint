import { signInUser, signOutUser, signUpUser } from "@/api/auth";
import { SignInFormData } from "@/components/auth/signin-form";
import { SignUpFormData } from "@/components/auth/signup-form";
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
  markVerified: () => Promise<void>;
  signin: (credentials: SignInFormData) => Promise<void>;
  signup: (credentials: SignUpFormData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string) => void;
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

        setAccessToken: (token: string) => set({ accessToken: token }),

        checkAuth: async () => {
          set({ isLoading: true, error: null });
          try {
            const userData = await getCurrentUser();
            set({ user: userData.data, isAuthed: true, isLoading: false });
          } catch (err) {
            console.error("Error while checking auth: ", err);
          } finally {
            set({ isLoading: false });
          }
        },

        markVerified: async () => {
          // TODO: add logic here
          set({ isOtpVerified: true });
          await get().checkAuth();
        },

        signin: async (credentials) => {
          set({ isSubmitting: true, error: null });
          try {
            const response = await signInUser(credentials);

            get().setAccessToken(response.data.accessToken);
          } catch (err) {
            set({ error: "Login failed" });
            throw err;
          } finally {
            set({ isSubmitting: false });
          }
        },

        signup: async (credentials) => {
          set({ isSubmitting: true, error: null });
          try {
            const response = await signUpUser(credentials);

            get().setAccessToken(response.data.accessToken);
          } catch (err) {
            set({ error: "Signup failed" });
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
