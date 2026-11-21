# AI Email Management Agent – Automation Workflow

## Overview

This automation uses Make to process incoming emails, analyze their content using an AI model, extract actionable information, and generate contextual reply drafts.

The system stores processed email data in Google Sheets and integrates with a Google Apps Script dashboard where the user can review, edit, approve, send, or reject generated replies.

## Workflow Architecture

```text
Incoming Email (Gmail)
        |
        v
Gmail Watch Emails
        |
        v
Filter
        |
        v
AI Email Analysis
        |
        v
JSON Parsing
        |
        v
Google Sheets - Store Email Analysis
        |
        v
AI Reply Generation
        |
        v
Google Sheets - Update Reply Draft
        |
        v
Dashboard Review
        |
        v
Human Approval
        |
        v
Reply Sent via Gmail
```

## Workflow Components

### 1. Gmail – Watch Emails

Monitors Gmail for incoming emails that meet the configured trigger conditions.

The automation retrieves relevant email information such as:
- Email ID
- Thread ID
- Sender information
- Subject
- Email body
- Received timestamp

### 2. Filter

Filters emails before they enter the AI processing pipeline.

The filter determines which emails are eligible for automated processing based on the configured conditions.

### 3. AI Email Analysis

An AI model analyzes the email and extracts structured information.

The analysis includes:

- Category
- Priority
- Summary
- Action items
- Deadline
- Whether a reply is required
- Sentiment

### 4. JSON Parsing

The AI-generated structured response is parsed into individual fields so that the information can be mapped to subsequent automation modules.

### 5. Google Sheets – Store Email Data

The analyzed email information is stored in Google Sheets.

The spreadsheet acts as the initial data store for email records and AI-generated analysis.

### 6. AI Reply Generation

When an email requires a response, the AI generates a contextual reply draft based on the original email content and extracted information.

The generated draft is stored in Google Sheets.

### 7. Google Sheets – Update Record

The automation updates the corresponding email record with the generated reply draft and relevant processing information.

### 8. Dashboard Review

The Google Apps Script dashboard retrieves email records from Google Sheets.

The user can:
- Review the original email.
- Review AI-generated analysis.
- Edit the reply draft.
- Save draft modifications.
- Reject a proposed reply.
- Approve and send a reply.

### 9. Human Approval

The system follows a human-in-the-loop approach.

AI-generated replies are not automatically sent. The user must review and approve a reply before sending it.

### 10. Gmail – Send Reply

Once approved, the system sends the reply through Gmail within the original email thread.

The dashboard updates the email's status after the sending operation.

## Technology Stack

| Component | Technology |
|---|---|
| Email service | Gmail |
| Automation platform | Make |
| AI model | NVIDIA-hosted AI model |
| AI model used | nvidia/nemotron-3.5-lightning-30b-a3b |
| Data storage | Google Sheets |
| Dashboard | Google Apps Script |
| Email sending | GmailApp |

## Design Principles

- Human approval before sending AI-generated replies.
- Structured extraction of email information.
- Centralized tracking through Google Sheets.
- Separation between automated analysis and human decision-making.
- Modular workflow for future improvements.

## Future Improvements

- Duplicate email prevention.
- Robust error handling and retry mechanisms.
- AI output validation.
- Prompt injection protection.
- Audit logging.
- Processing monitoring and notifications.
- Rate limiting.
- Improved data integrity and recovery mechanisms.
