# Database Schema

## Overview

The AI Email Management Agent uses Google Sheets as its primary data store for email records, AI-generated analysis, reply drafts, and email approval status.

The spreadsheet serves as the central data layer connecting the Make automation workflow with the Google Apps Script dashboard.

## Storage Technology

- **Database:** Google Sheets
- **Access:** Make automation and Google Apps Script
- **Data organization:** Tabular records
- **Primary record identifier:** Email ID
- **Conversation identifier:** Thread ID

## Email Record Schema

The primary sheet stores email records and associated AI analysis.

| Column | Field | Description |
|---|---|---|
| A | Email ID | Unique identifier for the email |
| B | Thread ID | Gmail conversation/thread identifier |
| C | Received At | Timestamp when the email was received |
| D | Sender Name | Name of the sender |
| E | Sender Email | Email address of the sender |
| F | Subject | Email subject |
| G | Email Content | Original email body |
| H | Category | AI-assigned email category |
| I | Priority | AI-assigned priority |
| J | Summary | AI-generated email summary |
| K | Action Items | Extracted tasks or actions |
| L | Deadline | Identified deadline |
| M | Requires Reply | Indicates whether a reply is required |
| N | Sentiment | AI-identified sentiment |
| O | Reply Draft | AI-generated reply draft |
| P | Approval Status | Current reply processing/approval status |
| Q | Processed At | Timestamp of processing or update |

## Field Details

### Email ID

The Gmail identifier associated with the email record.

This field is used to locate and identify the corresponding email record.

### Thread ID

The Gmail thread identifier used to maintain conversation context and send replies within the original thread.

### Received At

The timestamp associated with the original incoming email.

### Sender Name and Sender Email

Stores the sender's identifying information as provided by the email.

### Subject and Email Content

Stores the subject and original email content for analysis, review, and reply generation.

Email content is treated as external and potentially untrusted input.

### Category

The AI-generated classification of the email, based on its content.

### Priority

The AI-generated priority level assigned to the email.

### Summary

A concise AI-generated description of the email's main content.

### Action Items

Tasks, requests, or actions identified from the email.

### Deadline

A deadline identified from the email content, where applicable.

### Requires Reply

Indicates whether the email appears to require a response.

### Sentiment

The general sentiment detected in the email.

### Reply Draft

Stores the AI-generated reply for review and editing.

### Approval Status

Tracks the email's current state within the reply management workflow.

Statuses may include draft, rejected, sending, sent, or failure-related states, depending on the operation.

### Processed At

Stores the timestamp associated with processing or relevant record updates.

## Data Flow

1. Make retrieves an eligible email from Gmail.
2. The email is analyzed by the AI model.
3. Structured analysis is parsed.
4. The email and extracted information are stored in Google Sheets.
5. A reply draft is generated where applicable.
6. The corresponding record is updated.
7. The dashboard retrieves and displays the record.
8. The user reviews and acts on the draft.
9. The record's status is updated as the workflow progresses.

## Data Integrity Considerations

- Email IDs are used to identify email records.
- Thread IDs are retained to preserve conversation context.
- Email records should not be duplicated during processing.
- Status updates should accurately represent the workflow state.
- Sending operations require safeguards against concurrent actions.
- Failed sending operations should be reconciled before retrying.

## Privacy Considerations

Email records may contain confidential or personally identifiable information.

The public repository should not contain real email data, email addresses, Gmail identifiers, thread identifiers, or confidential message content.

Sample data in this repository should be synthetic and created solely for demonstration purposes.

## Future Improvements

- Dedicated processing ledger.
- Improved duplicate email detection.
- Audit log.
- Structured error records.
- Data retention policy.
- Improved validation of stored records.
- Migration from Google Sheets to a dedicated database if scalability requirements increase.
