# Reply Generation Prompt

## Purpose

This prompt is used to generate contextual email reply drafts based on the original email and relevant information extracted during the email analysis stage.

## AI Model

- Provider: NVIDIA
- Model: `nvidia/nemotron-3.5-lightning-30b-a3b`

## Reply Generation Objectives

The AI should:

- Understand the context of the original email.
- Generate a relevant and coherent reply.
- Maintain a professional communication tone.
- Avoid inventing facts, commitments, dates, or information not provided.
- Produce a draft suitable for human review.
- Avoid sending emails autonomously.

## Prompt Used

> Replace this section with the exact reply-generation prompt from your Make scenario.

The prompt should instruct the model to:

1. Read and understand the original email.
2. Consider the email summary and relevant action items.
3. Generate an appropriate reply.
4. Maintain a professional and context-appropriate tone.
5. Avoid unsupported claims or commitments.
6. Return only the reply draft in the expected format.

## Draft Handling

The generated reply is stored in Google Sheets and displayed in the dashboard.

The user can:

- Review the draft.
- Edit the draft.
- Save changes.
- Reject the draft.
- Approve and send the reply.

## Human-in-the-Loop Design

The system does not automatically send AI-generated replies.

A user must explicitly approve the reply through the dashboard before the email is sent through Gmail.

## Notes

Reply generation is intended to assist the user rather than replace human judgment.

Prompt injection protection, hallucination prevention, and additional output validation are planned improvements.
