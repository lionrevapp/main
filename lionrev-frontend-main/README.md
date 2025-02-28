
---

# LionRev CRM Frontend

This is the frontend component of the CRM application that lists Facebook Form Leads. It is built using React and communicates with the backend service to fetch the leads data via an API.

## Table of Contents

- [Project Setup](#project-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Configuration](#configuration)

## Project Setup

Before getting started with the frontend, ensure you have Node.js and npm (Node Package Manager) installed on your system.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/crm-project.git
   cd crm-project/frontend
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in the development mode.
- `npm build`: Builds the app for production to the `build` folder.

## Project Structure

The essential files and directories in the frontend part of this project are:

```plaintext
.
├── public/                 # Contains static files like index.html
├── src/                    # Source files for the React app
│   ├── components/         # React components (e.g., LeadList.js)
│   ├── App.js              # Main component
│   ├── index.js            # Entry point for React
├── package.json            # Project metadata and dependencies
└── README.md               # This documentation file
```

## Dependencies

The project relies on the following major dependencies:

- **React**: A JavaScript library for building user interfaces.
- **Axios**: A promise-based HTTP client for the browser and Node.js.

## Configuration

Currently, the application fetches data from a backend service running locally at `http://localhost:3001`. Ensure that the backend service is running before starting the frontend application to avoid errors while fetching leads data.

For connecting with external APIs like Zapier, refer to the documentation in your backend setup.

## Contact

For any issues or suggestions, please reach out to [yourname@example.com](mailto:yourname@example.com).

---

Feel free to modify the content to better match your project's specifics, such as updating the repository URL or contact information.