import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const queryClient = new QueryClient();

// Import the generated route tree
import App from "@/app";
import AuthProvider from "@/components/providers/auth-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRouteMask } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const signinModalToSigninMask = createRouteMask({
  routeTree,
  from: "/signin/modal",
  to: "/signin",
  unmaskOnReload: true,
});

const signupModalToSignupMask = createRouteMask({
  routeTree,
  from: "/signup/modal",
  to: "/signup",
  unmaskOnReload: true,
});

// Create a new router instance
export const router = createRouter({
  routeTree,
  routeMasks: [signinModalToSigninMask, signupModalToSignupMask],
  context: {
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct.",
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Render the app
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </StrictMode>,
  );
}
