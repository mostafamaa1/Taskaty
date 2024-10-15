import NextAuth from "next-auth";

// Extend the `token` and `session` types to include `accessToken`
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      token?: string; // Adding the token property here
    };
  }

  interface JWT {
    id: string;
    accessToken?: string; // Adding the accessToken here
  }
}
