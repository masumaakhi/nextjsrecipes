// //app/lib/auth.js
// import CredentialsProvider from "next-auth/providers/credentials";
// import User from "../models/user"; // ✅ Better path
// import bcrypt from "bcrypt";
// import connectDb from "./connectDb";

// export const authOptions = {
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         await connectDb();
//         const { email, password } = credentials;

//         const user = await User.findOne({ email });
//         if (!user) {
//           throw new Error("Invalid email or password");
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           throw new Error("Invalid email or password");
//         }

//         // ✅ Remove sensitive data before returning
//         return {
//           _id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       if (user) return true;
//       return false;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.user = user; // ✅ Only safe data passed here
//       } else {
//         await connectDb();
//         const userByEmail = await User.findOne({ email: token.email }).lean();
//         if (userByEmail) {
//           const { _id, name, email } = userByEmail;
//           token.user = { _id: _id.toString(), name, email };
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = token.user;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/auth/signin",
//   },
// };

// app/lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "../models/user";
import bcrypt from "bcrypt";
import connectDb from "./connectDb";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // ✅ Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ✅ Credentials Provider
    CredentialsProvider({
      async authorize(credentials) {
        await connectDb();
        const { email, password } = credentials;

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDb();

      // ✅ Google login handling
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create user if not found
          await User.create({
            name: user.name,
            email: user.email,
            googleId: user.id,
            image: user.image || "",
            isAccountVerified: true,
          });
        }
      }

      return true;
    },

        async jwt({ token, user }) {
      if (user) {
        token.user = user;
      } else {
        await connectDb();
        const userByEmail = await User.findOne({ email: token.email }).lean();
        if (userByEmail) {
          const { _id, name, email, role } = userByEmail;
          token.user = { _id: _id.toString(), name, email, role };
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/signin",
  },
};
