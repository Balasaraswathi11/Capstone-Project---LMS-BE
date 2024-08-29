# Capstone Project - LMS BE

## Overview

The Capstone Project for LMS (Learning Management System) BE (Backend) is a comprehensive backend solution for managing educational content, lectures, and user progress. This project provides a robust backend API for a learning management system, enabling features such as lecture management, user progress tracking, and more.

## Features

- **Lecture Management**: Create, update, delete, and fetch lectures.
- **User Progress Tracking**: Track and update user progress in various courses.
- **Authentication**: Secure endpoints with token-based authentication.
- **Error Handling**: Proper error messages and status codes for better user experience.

## Technologies Used

- **Node.js**: JavaScript runtime used for server-side logic.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing lecture and user data.
- **JWT**: JSON Web Tokens for authentication.
- **Axios**: Promise-based HTTP client for making requests.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Postman or any API client for testing

### Setup

1. **Clone the Repository**

    ```bash
    git clone https://github.com/Balasaraswathi11/Capstone-Project---LMS-BE.git
    cd Capstone-Project---LMS-BE
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Create a `.env` File**

    Copy the example environment file and fill in the necessary values:

    ```bash
    cp .env.example .env
    ```

    Update `.env` with your MongoDB connection string and other configuration values.

4. **Run the Application**

    ```bash
    npm start
    ```

    The server will start on `http://localhost:5000` by default. You can change the port in the `.env` file if needed.

## API Endpoints

### Lectures

- **GET** `/api/course/fetchlectures/:courseId`
  - Fetch all lectures for a specific course.

- **GET** `/api/course/fetchalecture/:lectureId`
  - Fetch a specific lecture by ID.

- **POST** `/api/admin/course/:courseId`
  - Add a new lecture to a course.

- **DELETE** `/api/admin/lecture/:lectureId`
  - Delete a specific lecture by ID.

### Progress

- **GET** `/api/user/getprogress?course=:courseId`
  - Fetch user progress for a specific course.

- **POST** `/api/user/progress?course=:courseId&lectureId=:lectureId`
  - Update user progress for a specific lecture in a course.

## Usage

To use the API, you need to have a valid JWT token. Pass the token in the `Authorization` header for protected routes.

Example:

```http
Authorization: Bearer <your-token>
