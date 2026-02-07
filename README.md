# React CRUD - User Management
 
 A simple React CRUD (Create, Read, Update, Delete) app to manage users via an HTTP API.
 
 - UI: React + Material UI
 - API: configurable base URL (defaults to a local JSON Server mock)
 - Extensibility: form + table are rendered from a field schema so adding new fields is low-effort
 
 ## Setup
 
 In the project directory:
 
 ```bash
 npm install
 ```
 
 ## Run with mock API (JSON Server)
 
 Terminal 1 (API on `http://localhost:3001`):
 
 ```bash
 npm run api
 ```
 
 Terminal 2 (React on `http://localhost:3000`):
 
 ```bash
 npm start
 ```
 
 The mock database lives in `db.json`.
 
 ## Configure API base URL
 
 By default the app uses `http://localhost:3001`.
 
 To point to a real backend, set:
 
 ```bash
 REACT_APP_API_BASE_URL=https://your-api.example.com
 ```
 
 (Create React App reads `.env` files too, e.g. put it in `.env.local`.)
 
 ## How to add new fields (extensibility)
 
 Fields are configuration-driven.
 
 - Add/edit fields in `src/config/userFields.js`.
 - The form (`src/components/UserForm.js`) and table (`src/components/UserTable.js`) render from this schema.
 - Validation is per-field via the `validate` function.
 
 Example: add Date of Birth
 
 1. Add a new entry to `userFields`:
 
 ```js
 {
   name: 'dob',
   label: 'Date of Birth',
   required: true,
   type: 'date',
   validate: (value) => (!value ? 'Date of Birth is required' : null),
 }
 ```
 
 2. Ensure the backend (or `db.json`) supports that field.
 
 No other UI changes are required.
 
 ## Design notes / assumptions
 
 - CRUD endpoints follow JSON Server conventions:
   - `GET /users`
   - `POST /users`
   - `PUT /users/:id`
   - `DELETE /users/:id`
 - Minimal state management is handled in `src/hooks/useUsers.js`.
 - Errors are surfaced via an alert and successes via toast notifications.
