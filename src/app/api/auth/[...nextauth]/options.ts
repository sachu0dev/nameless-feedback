import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-expect-error: Environment variables might be undefined but are handled with fallback
      async authorize(credentials: {
        identifier: string;
        password: string;
      }): Promise<User | null> {
        await dbConnect();
        try {
          const user = (await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          })) as User;

          if (!user) {
            throw new Error("No user found with this email or username.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in.");
          }

          if (user.googleId && !user.password) {
            throw new Error(
              "This account is registered with Google. Please log in using Google."
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password as string
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password.");
          }
        } catch (err) {
          throw new Error((err as Error).message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log(user);

        try {
          await dbConnect();
          console.log("User  from Google:", user);
          let existingUser = (await UserModel.findOne({
            email: user.email,
          })) as User;
          if (!existingUser) {
            const sanitizedUsername = (user.name || "").replace(/\s+/g, "");
            existingUser = await UserModel.create({
              email: user.email,
              username: sanitizedUsername,
              password: null,
              verifyCode: null,
              verifyCodeExpireAt: null,
              isVerified: true,
              isAcceptingMessages: true,
              messages: [],
              googleId: user.id,
            });
          }
          user._id = existingUser._id;
          user.isVerified = existingUser.isVerified;
          user.isAcceptingMessages = existingUser.isAcceptingMessages;
          user.username = existingUser.username;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error: Expecting _id to be a string as per JWT callback
        token._id = user._id.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
