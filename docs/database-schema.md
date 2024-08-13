# Database Schema

## Users
- **id**: Primary key
- **username**: String, unique
- **email**: String, unique
- **password**: String (hashed)
- **role**: Enum ('admin', 'client', 'developer')
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Projects
- **id**: Primary key
- **name**: String
- **description**: Text
- **status**: Enum ('active', 'completed', 'archived')
- **start_date**: Date
- **end_date**: Date
- **client_id**: Foreign key (references users)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Boards
- **id**: Primary key
- **name**: String
- **description**: Text
- **project_id**: Foreign key (references projects)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Lists
- **id**: Primary key
- **name**: String
- **position**: Integer (to manage the order of lists within a board)
- **board_id**: Foreign key (references boards)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Tasks
- **id**: Primary key
- **title**: String
- **description**: Text
- **status**: Enum ('to-do', 'in-progress', 'done')
- **due_date**: Date
- **list_id**: Foreign key (references lists)
- **assigned_to**: Foreign key (references users)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Checklists
- **id**: Primary key
- **name**: String
- **task_id**: Foreign key (references tasks)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## ChecklistItems
- **id**: Primary key
- **description**: String
- **is_completed**: Boolean (default: false)
- **checklist_id**: Foreign key (references checklists)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Documents
- **id**: Primary key
- **name**: String
- **url**: String
- **project_id**: Foreign key (references projects)
- **uploaded_by**: Foreign key (references users)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Messages
- **id**: Primary key
- **content**: Text
- **sender_id**: Foreign key (references users)
- **receiver_id**: Foreign key (references users)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Invoices
- **id**: Primary key
- **amount**: Decimal
- **status**: Enum ('pending', 'paid', 'overdue')
- **client_id**: Foreign key (references users)
- **project_id**: Foreign key (references projects)
- **quickbooks_invoice_id**: String (stores the QuickBooks invoice ID)
- **synced_with_quickbooks**: Boolean (tracks if the invoice has been synced)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Payments
- **id**: Primary key
- **invoice_id**: Foreign key (references invoices)
- **amount**: Decimal
- **payment_date**: Timestamp
- **payment_method**: String (e.g., credit card, bank transfer)
- **quickbooks_payment_id**: String (stores the QuickBooks payment ID)
- **synced_with_quickbooks**: Boolean (tracks if the payment has been synced)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## QuickBooksTokens
- **id**: Primary key
- **user_id**: Foreign key (references users)
- **access_token**: Text (stores the QuickBooks access token)
- **refresh_token**: Text (stores the QuickBooks refresh token)
- **token_expires_at**: Timestamp (when the access token expires)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Feedback
- **id**: Primary key
- **content**: Text
- **rating**: Integer
- **project_id**: Foreign key (references projects)
- **submitted_by**: Foreign key (references users)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Notes
- **id**: Primary key
- **content**: Text
- **user_id**: Foreign key (references users)
- **project_id**: Foreign key (references projects)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Reminders
- **id**: Primary key
- **content**: Text
- **due_date**: Date
- **user_id**: Foreign key (references users)
- **project_id**: Foreign key (references projects)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## CalendarEntries
- **id**: Primary key
- **title**: String
- **description**: Text
- **start_time**: Timestamp
- **end_time**: Timestamp
- **user_id**: Foreign key (references users)
- **project_id**: Foreign key (references projects)
- **task_id**: Foreign key (references tasks)
- **reminder_id**: Foreign key (references reminders)
- **note_id**: Foreign key (references notes)
- **created_at**: Timestamp
- **updated_at**: Timestamp
