import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyOTP } from "@/services/auth";
import { JWT } from "next-auth/jwt";
import jwt from "jsonwebtoken";

// Define custom user type
interface CustomUser {
  id: string;
  token: string;
  role: string;
}

// Update the JWT type
interface CustomJWT extends JWT {
  accessToken: string;
}

const nextAuthConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "PhoneOTP",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Phone and OTP are required");
        }

        try {
          const response = await verifyOTP({
            phone: credentials.phone.toString(),
            otp: credentials.otp.toString(),
          });

          if (response.data?.token) {
            // Decode the JWT to get user information
            const decodedToken = jwt.decode(response.data.token) as {
              id: string;
              role: string;
            } | null;

            if (!decodedToken) {
              throw new Error("Invalid token");
            }

            return {
              id: decodedToken.id,
              token: response.data.token,
              role: decodedToken.role,
            };
          } else {
            throw new Error("OTP verification failed: No token returned");
          }
        } catch (error) {
          throw error; // Re-throw the error for better error handling
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<CustomJWT> {
      if (user) {
        return {
          ...token,
          id: user.id ?? "",
          role: (user as CustomUser).role ?? "",
          accessToken: (user as CustomUser).token ?? "",
        };
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          accessToken: token.accessToken,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  events: {
    async signOut({}) {
      // Perform any additional server-side cleanup here
      // For example, you might want to invalidate the token on your backend
      // await invalidateTokenOnBackend(token.accessToken);
    },
  },
  // Add any additional configuration options here
  session: {
    strategy: "jwt",
  },
  // Optionally, add custom error handling
  // logger: {
  //   error(code, metadata) {
  //     console.error(code, metadata);
  //   },
  // },
};

export default nextAuthConfig;
