# Setup Guide

## Overview

This guide outlines the services and configuration required to set up a personal instance of the AI Email Management Agent.

The repository contains sanitized project files and documentation. The setup process requires configuring your own Google services, Make scenario, and AI provider access.

## Prerequisites

- A Google account.
- Gmail access.
- Google Sheets.
- Google Apps Script.
- Make account.
- Access to an AI model provider.
- Basic familiarity with Google Apps Script and Make.

## 1. Create a Google Spreadsheet

1. Create a new Google Spreadsheet.
2. Create or rename the primary worksheet.
3. Configure the spreadsheet columns according to `database/schema.md`.
4. Keep the spreadsheet private and restrict access appropriately.

The spreadsheet will serve as the central data store for the automation and dashboard.

## 2. Configure Google Apps Script

1. Open the Google Spreadsheet.
2. Open Extensions → Apps Script.
3. Create or configure the Apps Script project.
4. Add `Code.gs` and `Index.html` from the repository's `apps-script/` directory.
5. Configure the spreadsheet ID and sheet name in the backend code.
6. Review the Apps Script manifest and required OAuth scopes.
7. Authorize the required permissions.

## 3. Configure Make

1. Create a Make account or open your existing account.
2. Create a new scenario.
3. Connect your Gmail account.
4. Configure the Gmail email trigger.
5. Add the required filtering conditions.
6. Configure access to your AI model provider.
7. Add the email-analysis module.
8. Configure JSON parsing.
9. Connect Google Sheets and map the required fields.
10. Configure reply generation.
11. Add the Google Sheets update operation.
12. Test each module individually before activating the scenario.

Refer to `automation/workflow.md` for the documented workflow architecture.

## 4. Configure AI Access

1. Obtain API access from your chosen AI provider.
2. Configure the API connection securely within Make.
3. Select the supported AI model.
4. Configure the email-analysis prompt.
5. Configure the reply-generation prompt.
6. Test model outputs and verify that the expected structured format is returned.

Never commit API keys, tokens, or credential-bearing configuration files to this repository.

## 5. Configure the Dashboard

1. Configure the Apps Script backend to use your spreadsheet.
2. Review the dashboard functions.
3. Verify that email records can be retrieved.
4. Verify that drafts can be saved and rejected.
5. Verify that approved replies are sent through the original Gmail thread.
6. Test status updates and sending safeguards.

## 6. Deploy the Apps Script Web App

1. Open the Apps Script project.
2. Select Deploy → New deployment.
3. Choose Web app.
4. Configure the deployment execution settings according to your security requirements.
5. Review access permissions carefully.
6. Deploy.
7. Test the deployment using your own account.

Do not publicly expose an email management dashboard that can access or send emails without appropriate authentication and authorization controls.

## 7. Test the System

Before using the system with real email data:

- Use synthetic test emails.
- Verify filtering conditions.
- Verify email analysis.
- Verify JSON parsing.
- Verify spreadsheet mapping.
- Verify reply generation.
- Verify dashboard loading.
- Verify draft editing and saving.
- Verify rejection.
- Verify approval and sending.
- Verify that emails are sent in the intended thread.

Refer to `docs/testing.md`.

## Security Recommendations

- Keep the spreadsheet private.
- Secure Apps Script deployment permissions.
- Never commit API keys or credentials.
- Avoid publishing real email content.
- Use synthetic test data.
- Review AI-generated replies before sending.
- Reconcile uncertain sending outcomes before retrying.
- Do not use the prototype with sensitive emails until security and reliability requirements have been evaluated.

## Disclaimer

This repository is a sanitized demonstration of an AI-powered email management workflow.

Configuration, permissions, deployment, and security requirements may vary depending on the Google and AI provider accounts used.
