# FreshFlow - Sustainable Food Management System

A comprehensive food waste management system for grocery stores, helping to reduce waste and increase sustainability through intelligent monitoring and reporting.

## Features

- **Inventory Management**: Track products and expiry dates
- **Analytics & Reports**: Data-driven insights for waste reduction
- **Waste Reduction**: Minimize environmental impact
- **Team Management**: Role-based access control (Staff, Manager, Admin)
- **Donation Management**: Coordinate food donations to local organizations
- **Composting**: Track composting initiatives

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database named `mydb` (or update the database name in your environment variables)
2. Import your database schema (make sure you have the `admin`, `staff`, `manager`, and other required tables)

Use Visual Studio Code for best experience!!!!
### 2. Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=mydb
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. Set up the admin account:
   ```bash
   node setup-admin.js
   ```

5. Start the backend server:
   ```bash
   npm start or node server.js
   ```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

1. Navigate to the project root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:8080`

## Default Login Credentials

### Admin Account
- **Email**: admin@freshflow.com
- **Password**: admin123
- **Access**: Full system access, user management, analytics

### Creating Additional Accounts

You can create new accounts through the signup form on the login page:

1. **Staff Accounts**: Can manage inventory, record waste, and submit requests
2. **Manager Accounts**: Can approve requests, view reports, and manage staff

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Routes
- `GET /staff` - Get all staff members (Admin/Manager only)
- `POST /staff` - Create new staff member (Admin/Manager only)
- `PUT /staff/:id` - Update staff member (Admin/Manager only)
- `DELETE /staff/:id` - Delete staff member (Admin only)

### Analytics
- `GET /api/waste-summary` - Get waste summary statistics
- `GET /api/monthly-waste-trends` - Get monthly waste trends
- `GET /api/expired-products` - Get expired products data
- `GET /api/waste-volume` - Get waste volume data

## Project Structure

```
freshflow1.0-frontend/
├── Backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── setup-admin.js      # Admin account setup script
│   └── package.json
├── src/
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   └── types.ts           # TypeScript type definitions
└── package.json
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Make sure your MySQL server is running and the credentials in `.env` are correct
2. **CORS Error**: The backend is configured to allow CORS from the frontend development server
3. **Admin Login Fails**: Run the `setup-admin.js` script to create the admin account

### Getting Help

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the terminal running the backend server for backend errors
3. Ensure all dependencies are installed correctly
4. Verify database connectivity and table structure

## Security Notes

- Change the default JWT secret in production
- Use strong passwords for database access
- Consider implementing rate limiting for authentication endpoints
- Regularly update dependencies for security patches
