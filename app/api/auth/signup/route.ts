import { connectDB } from '@/lib/db'; // Importing the connectDB function from the db module
import { UserModel } from '@/lib/models/User'; // Importing the UserModel from the User model
import { NextResponse } from 'next/server'; // Importing the NextResponse class from the next/server module
import bcrypt from 'bcrypt'; // Importing the bcrypt library for password hashing
import mongoose from 'mongoose'; // Importing the mongoose library for MongoDB

export async function POST(request: Request) { // Defining the POST function for the signup route
  try { // Starting a try-catch block for error handling
    await connectDB(); // Connecting to the database

    const { name, email, password } = await request.json(); // Destructuring the name, email, and password from the request body

    // Validate input
    if (!name || !email || !password) { // Checking if any of the fields are missing
      return NextResponse.json( // Returning a JSON response
        { message: 'All fields are required' }, // With a message indicating all fields are required
      );
    }

    if (password.length < 6) { // Checking if the password is less than 6 characters
      return NextResponse.json( // Returning a JSON response
        { message: 'Password must be at least 6 characters' }, // With a message indicating the password must be at least 6 characters
        { status: 400 }, // And a status code of 400 (Bad Request)
      );
    }

    const userFound = await UserModel.findOne({ email }); // Checking if a user with the same email already exists

    if (userFound) { // If a user with the same email exists
      return NextResponse.json( // Returning a JSON response
        { message: 'Email already exists' }, // With a message indicating the email already exists
        { status: 409 }, // And a status code of 409 (Conflict)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password with a salt of 10

    const user = new UserModel({ // Creating a new user with the provided name, email, and hashed password
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save(); // Saving the new user to the database

    return NextResponse.json( // Returning a JSON response
      {
        name: savedUser.name, // With the saved user's name
        email: savedUser.email, // And the saved user's email
      },
      { status: 200 }, // And a status code of 200 (OK)
    );
  } catch (error) { // Catching any errors that occur
    console.log(error); // Logging the error
    if (error instanceof mongoose.Error.ValidationError) { // Checking if the error is a validation error from mongoose
      return NextResponse.json({ message: error.message }, { status: 400 }); // Returning a JSON response with the error message and a status code of 400 (Bad Request)
    } else { // If the error is not a validation error
      console.error('Error during signup:', error); // Logging the error
      return NextResponse.error(); // Returning a generic error response
    }
  }
}
