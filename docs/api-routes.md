# API Routes

## Authentication

- **POST** `/api/auth/login`
  - Authenticate user and return JWT token.

- **POST** `/api/auth/register`
  - Register a new user.

- **POST** `/api/auth/logout`
  - Logout user and invalidate token.

- **POST** `/api/auth/refresh-token`
  - Refresh JWT token.

## User Management

- **GET** `/api/users`
  - Get all users (Admin only).

- **GET** `/api/users/:id`
  - Get a single user by ID.

- **PUT** `/api/users/:id`
  - Update user information.

- **DELETE** `/api/users/:id`
  - Delete a user (Admin only).

## Projects

- **GET** `/api/projects`
  - Get all projects.

- **POST** `/api/projects`
  - Create a new project.

- **GET** `/api/projects/:id`
  - Get a single project by ID.

- **PUT** `/api/projects/:id`
  - Update a project.

- **DELETE** `/api/projects/:id`
  - Delete a project.

## Boards

- **GET** `/api/projects/:projectId/boards`
  - Get all boards for a project.

- **POST** `/api/projects/:projectId/boards`
  - Create a new board for a project.

- **GET** `/api/boards/:id`
  - Get a single board by ID.

- **PUT** `/api/boards/:id`
  - Update a board.

- **DELETE** `/api/boards/:id`
  - Delete a board.

## Lists

- **GET** `/api/boards/:boardId/lists`
  - Get all lists for a board.

- **POST** `/api/boards/:boardId/lists`
  - Create a new list within a board.

- **GET** `/api/lists/:id`
  - Get a single list by ID.

- **PUT** `/api/lists/:id`
  - Update a list.

- **DELETE** `/api/lists/:id`
  - Delete a list.

## Tasks

- **GET** `/api/lists/:listId/tasks`
  - Get all tasks for a list.

- **POST** `/api/lists/:listId/tasks`
  - Create a new task within a list.

- **GET** `/api/tasks/:id`
  - Get a single task by ID.

- **PUT** `/api/tasks/:id`
  - Update a task.

- **DELETE** `/api/tasks/:id`
  - Delete a task.

## Checklists

- **GET** `/api/tasks/:taskId/checklists`
  - Get all checklists for a task.

- **POST** `/api/tasks/:taskId/checklists`
  - Create a new checklist within a task.

- **GET** `/api/checklists/:id`
  - Get a single checklist by ID.

- **PUT** `/api/checklists/:id`
  - Update a checklist.

- **DELETE** `/api/checklists/:id`
  - Delete a checklist.

## Checklist Items

- **GET** `/api/checklists/:checklistId/items`
  - Get all items in a checklist.

- **POST** `/api/checklists/:checklistId/items`
  - Create a new checklist item.

- **GET** `/api/items/:id`
  - Get a single checklist item by ID.

- **PUT** `/api/items/:id`
  - Update a checklist item.

- **DELETE** `/api/items/:id`
  - Delete a checklist item.

- **PUT** `/api/items/:id/toggle`
  - Toggle the completion status of a checklist item.

## Documents

- **GET** `/api/projects/:projectId/documents`
  - Get all documents for a project.

- **POST** `/api/projects/:projectId/documents`
  - Upload a new document for a project.

- **GET** `/api/documents/:id`
  - Get a single document by ID.

- **DELETE** `/api/documents/:id`
  - Delete a document.

## Messaging

- **GET** `/api/messages`
  - Get all messages.

- **POST** `/api/messages`
  - Send a new message.

- **GET** `/api/messages/:id`
  - Get a single message by ID.

## Billing and Payments

### QuickBooks Integration

- **GET** `/api/quickbooks/auth/connect`
  - Redirect the user to QuickBooks for OAuth authentication.

- **GET** `/api/quickbooks/auth/callback`
  - Handle the callback from QuickBooks and store the OAuth tokens.

- **GET** `/api/quickbooks/auth/disconnect`
  - Revoke QuickBooks access and delete the OAuth tokens.

- **POST** `/api/quickbooks/invoices/sync`
  - Sync a specific invoice with QuickBooks.
  - Request Body: `{ "invoice_id": 123 }`

- **POST** `/api/quickbooks/invoices/sync-all`
  - Sync all unsynced invoices with QuickBooks.

- **GET** `/api/quickbooks/invoices/:id`
  - Get the details of a specific invoice from QuickBooks.

- **DELETE** `/api/quickbooks/invoices/:id`
  - Delete an invoice from QuickBooks.

- **POST** `/api/quickbooks/payments/sync`
  - Sync a specific payment with QuickBooks.
  - Request Body: `{ "payment_id": 456 }`

- **POST** `/api/quickbooks/payments/sync-all`
  - Sync all unsynced payments with QuickBooks.

- **GET** `/api/quickbooks/payments/:id`
  - Get the details of a specific payment from QuickBooks.

- **DELETE** `/api/quickbooks/payments/:id`
  - Delete a payment from QuickBooks.

- **GET** `/api/quickbooks/reports/income-statement`
  - Fetch an income statement report from QuickBooks.

- **GET** `/api/quickbooks/reports/balance-sheet`
  - Fetch a balance sheet report from QuickBooks.

- **GET** `/api/quickbooks/reports/cash-flow`
  - Fetch a cash flow statement report from QuickBooks.

### Internal Invoices and Payments

- **GET** `/api/invoices`
  - Get all invoices from your application database.

- **GET** `/api/invoices/:id`
  - Get a single invoice by ID from your application database.

- **POST** `/api/invoices`
  - Create a new invoice.

- **PUT** `/api/invoices/:id`
  - Update an invoice.

- **DELETE** `/api/invoices/:id`
  - Delete an invoice.

- **GET** `/api/payments`
  - Get all payments from your application database.

- **GET** `/api/payments/:id`
  - Get a single payment by ID from your application database.

- **POST** `/api/payments`
  - Record a new payment.

- **PUT** `/api/payments/:id`
  - Update a payment.

- **DELETE** `/api/payments/:id`
  - Delete a payment.

## Feedback and Approvals

- **GET** `/api/projects/:projectId/feedback`
  - Get all feedback for a project.

- **POST** `/api/projects/:projectId/feedback`
  - Submit feedback for a project.

- **GET** `/api/feedback/:id`
  - Get a single feedback by ID.

- **PUT** `/api/feedback/:id`
  - Update feedback.

- **DELETE** `/api/feedback/:id`
  - Delete feedback.

## Notes and Reminders

### Notes

- **GET** `/api/notes`
  - Get all notes.

- **POST** `/api/notes`
  - Create a new note.

- **GET** `/api/notes/:id`
  - Get a single note by ID.

- **PUT** `/api/notes/:id`
  - Update a note.

- **DELETE** `/api/notes/:id`
  - Delete a note.

### Reminders

- **GET** `/api/reminders`
  - Get all reminders.

- **POST** `/api/reminders`
  - Create a new reminder.

- **GET** `/api/reminders/:id`
  - Get a single reminder by ID.

- **PUT** `/api/reminders/:id`
  - Update a reminder.

- **DELETE** `/api/reminders/:id`
  - Delete a reminder.

## Calendar Entries

- **GET** `/api/calendar`
  - Get all calendar entries.

- **POST** `/api/calendar`
  - Create a new calendar entry.

- **GET** `/api/calendar/:id`
  - Get a single calendar entry by ID.

- **PUT** `/api/calendar/:id`
  - Update a calendar entry.

- **DELETE** `/api/calendar/:id`
  - Delete a calendar entry.

## Reports and Analytics

- **GET** `/api/reports/projects`
  - Get project status reports.

- **GET** `/api/reports/billing`
  - Get billing and payment reports.
