// components/ClientProviders.tsx
"use client"; // Mark this as a client component

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import Provider from "@/query-client/provider";
import { Toaster } from "sonner";
import UserDataInitializer from "./UserDataInit";
import store from "@/store";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <Provider>
          <UserDataInitializer>{children}</UserDataInitializer>
          <Toaster position="top-right" />
        </Provider>
      </ReduxProvider>
    </SessionProvider>
  );
}
