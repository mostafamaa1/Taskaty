# Taskaty 
#### A Real-Time Task Management Dashboard

Taskaty is a full-stack task management application built with Next.js, MongoDB, TypeScript, Socket.IO, Tailwind CSS, and Next-Auth. This application provides a user-friendly interface for managing tasks using a Kanban board and a list view, allowing users to add, update, and delete tasks in real-time.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration using Next-Auth.
- **Real-time Updates**: Task updates are reflected in real-time using Socket.IO.
- **Task Management**: Create, update, and delete tasks with priority and due date.
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI.
- **Multiple Views**: Switch between Kanban board and list view for task management.
- **Internationalization**: Supports English and Arabic languages using Next-Intl.

## Project Structure

Here is a high-level overview of the project structure, highlighting the main features of the Taskaty application:

```
task-management-dashboard/
├── app/
│   ├── [locale]/                     # Localization support for different languages
│   │   ├── layout.tsx                # Main layout for the application
│   │   ├── login/                    # Login page for user authentication
│   │   │   └── page.tsx              # Login page component
│   │   └── page.tsx                  # Home page component
│   ├── api/                          # API routes for server-side functionality
│   │   └── tasks/                    # Task-related API routes
│   │       └── crud/                 # CRUD operations for tasks
│   │           └── route.ts           # API route handler for task operations
│   ├── components/                   # Reusable UI components
│   │   ├── AddUpdateModal.tsx        # Modal for adding/updating tasks
│   │   ├── DeleteModal.tsx           # Modal for confirming task deletion
│   │   ├── EditDeleteMenu.tsx        # Menu for editing or deleting tasks
│   │   ├── Header.tsx                # Header component with navigation
│   │   ├── Kanban.tsx                # Kanban board view for task management
│   │   ├── Sidebar.tsx               # Sidebar for navigation and view switching
│   │   └── Tasklist.tsx              # List view for displaying tasks
│   ├── lib/                          # Library functions and utilities
│   │   ├── auth.ts                   # Authentication logic
│   │   ├── constants.ts              # Constants used throughout the app
│   │   └── db.ts                     # Database connection logic
│   ├── store/                        # State management using Zustand
│   │   ├── dashboardStore.ts         # Store for dashboard state (view, user)
│   │   └── taskStore.ts              # Store for task-related state
│   ├── types/                        # Type definitions for TypeScript
│   │   └── types.ts                  # Type definitions for tasks and user
│   └── globals.css                   # Global CSS styles
├── public/                           # Public assets (e.g., fonts, images)
│   └── fonts/                        # Custom fonts used in the application
├── server.js                         # Server setup and Socket.IO configuration
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation
```


## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **MongoDB**: A NoSQL database for storing task data.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Socket.IO**: A library for real-time web applications, enabling real-time communication between clients and servers.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Next-Auth**: A complete open-source authentication solution for Next.js applications.
- **Next-Intl**: A library for internationalization, providing support for multiple languages.

## Setup Instructions

Follow these steps to set up the Taskaty application locally:

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or cloud instance)
- A code editor (e.g., Visual Studio Code)

### Step 1: Clone the Repository

Clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/task-management-dashboard.git
cd task-management-dashboard
```

### Step 2: Install Dependencies

Install the required dependencies using npm or yarn:
```bash
bash
npm install
or
yarn install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_NEXTAUTH_SECRET
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_NEXTAUTH_SECRET` with a secure string and `your_mongodb_connection_string` with your MongoDB connection string.

### Step 4: Start the Development Server

Run the following command to start the development server:
```bash
npm run dev
or
yarn dev
```

The application should now be running on `http://localhost:3000`.

### Step 5: Access the Application

Open your web browser and navigate to `http://localhost:3000` to access the Taskaty application.

## Usage

1. **Login**: Use the login page to authenticate users. You can log in from two different browsers with different accounts.
2. **Task Management**: Users can add, update, and delete tasks. The changes will be reflected in real-time across all connected clients.
3. **Switch Views**: Users can toggle between the Kanban board and list view for task management.
4. **Language Support**: Switch between English and Arabic languages using the language selector in the UI.

### Real-time Features

To test the real-time features:
- Open two different browsers or incognito windows.
- Log in with different accounts in each browser.
- Try adding, updating, or deleting tasks in one browser and observe the real-time notifications in the other browser.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
