// Importing authOptions from the local auth library
import { authOptions } from "@/lib/auth";
// Importing NextAuth for authentication handling
import NextAuth from "next-auth";

// Creating a handler function using NextAuth with authOptions
const handler = NextAuth(authOptions);

// Exporting the handler function for both GET and POST requests
export { handler as GET, handler as POST };
