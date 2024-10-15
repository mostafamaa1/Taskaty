import { NextRequest, NextResponse } from 'next/server'; // Importing NextRequest and NextResponse from next/server
import { TaskModel } from '@/lib/models/Task'; // Importing TaskModel from the Task model
import { connectDB } from '@/lib/db'; // Importing connectDB function from the db module
import { getToken } from 'next-auth/jwt'; // Importing getToken function from next-auth/jwt for token verification

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET }); // Attempting to get the token from the request

  if (!token) {
    return NextResponse.json(
      {
        message: 'Unauthorized Access',
      },
      { status: 401 },
    ); // Returning unauthorized access if no token is found
  }
  try {
    await connectDB(); // Connecting to the database
    const tasks = await TaskModel.find({ user: token?.email }); // Finding tasks for the user
    return NextResponse.json(
      {
        tasks: tasks,
      },
      { status: 200 },
    ); // Returning tasks with a status of 200
  } catch (error: any) {
    console.error('Error Fetching tasks:', error.message); // Logging error if fetching tasks fails
    return NextResponse.json(
      {
        message: 'Server error',
      },
      { status: 500 },
    ); // Returning server error with a status of 500
  }
};

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET }); // Attempting to get the token from the request

  if (!token) {
    return NextResponse.json(
      {
        message: 'Unauthorized Access',
      },
      { status: 401 },
    ); // Returning unauthorized access if no token is found
  }
  try {
    await connectDB(); // Connecting to the database
    const body = await req.json(); // Parsing the request body
    const { title, description, status, priority, dueDate, user } = body; // Destructuring task properties from the body

    const newTask = new TaskModel({
      title,
      description,
      status,
      priority,
      dueDate,
      user,
    }); // Creating a new task

    await newTask.save(); // Saving the new task to the database
    return NextResponse.json(
      {
        message: 'Task added successfully',
        task: newTask,
      },
      { status: 200 },
    ); // Returning success message with the new task and a status of 200
  } catch (error: any) {
    console.error('Error adding task:', error.message); // Logging error if adding task fails
    return NextResponse.json(
      {
        message: 'Server error',
      },
      { status: 500 },
    ); // Returning server error with a status of 500
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET }); // Attempting to get the token from the request

  if (!token) {
    return NextResponse.json(
      {
        message: 'Unauthorized Access',
      },
      { status: 401 },
    ); // Returning unauthorized access if no token is found
  }
  try {
    await connectDB(); // Connecting to the database
    const body = await req.json(); // Parsing the request body
    const { _id, title, description, status, priority, dueDate } = body; // Destructuring task properties from the body

    if (!_id) {
      return NextResponse.json(
        {
          message: 'Task ID is required',
        },
        { status: 400 },
      ); // Returning error if task ID is missing
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
      },
      { new: true },
    ); // Updating the task

    if (!updatedTask) {
      return NextResponse.json(
        {
          message: 'Task not found',
        },
        { status: 404 },
      ); // Returning error if task is not found
    }

    return NextResponse.json({
      task: updatedTask,
      status: 200,
    }); // Returning the updated task with a status of 200
  } catch (error: any) {
    console.error('Error updating task:', error.message); // Logging error if updating task fails
    return NextResponse.json(
      {
        message: 'Server error',
      },
      { status: 500 },
    ); // Returning server error with a status of 500
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET }); // Attempting to get the token from the request

  if (!token) {
    return NextResponse.json(
      {
        message: 'Unauthorized Access',
      },
      { status: 401 },
    ); // Returning unauthorized access if no token is found
  }
  try {
    await connectDB(); // Connecting to the database
    const body = await req.json(); // Parsing the request body
    const { _id } = body; // Destructuring task ID from the body

    if (!_id) {
      return NextResponse.json(
        {
          message: 'Task ID is required',
        },
        { status: 400 },
      ); // Returning error if task ID is missing
    }

    const result = await TaskModel.deleteOne({ _id }); // Deleting the task

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          message: 'Task not found',
        },
        { status: 404 },
      ); // Returning error if task is not found
    }

    return NextResponse.json(
      {
        message: 'Task deleted successfully',
      },
      { status: 200 },
    ); // Returning success message with a status of 200
  } catch (error: any) {
    console.error('Error deleting task:', error.message); // Logging error if deleting task fails
    return NextResponse.json(
      {
        message: 'Server error',
      },
      { status: 500 },
    ); // Returning server error with a status of 500
  }
}
