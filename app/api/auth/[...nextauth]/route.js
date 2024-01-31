import { connectToDB } from "@mongodb/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@models/User";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        try {
          await connectToDB();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }

          const isMatch = await compare(credentials.password, user.password);

          if (!isMatch) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          console.error(
            "Error during credential authorization:",
            error.message
          );
          return Promise.reject(new Error("Authentication failed"));
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      try {
        const sessionUser = await User.findOne({ email: session.user.email });
        session.user.id = sessionUser._id.toString();
        session.user = { ...session.user, ...sessionUser._doc };
      } catch (error) {
        console.error(
          "Error fetching user during session callback:",
          error.message
        );
      }
      return session;
    },

    async signIn({ account, profile }) {
      try {
        if (account.provider === "google") {
          await connectToDB();

          let user = await User.findOne({ email: profile.email });

          if (!user) {
            user = await User.create({
              email: profile.email,
              username: profile.name,
              profileImagePath: profile.picture,
              wishlist: [],
              cart: [],
              order: [],
              work: [],
            });
          }

          return user;
        }
      } catch (error) {
        console.error("Error during signIn callback:", error.message);
        return Promise.reject(new Error("Authentication failed"));
      }
    },
  },
});

export { handler as GET, handler as POST };
