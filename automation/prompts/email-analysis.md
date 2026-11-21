# Email Analysis Prompt

## Purpose

This prompt is used to analyze incoming emails and extract structured information that can be used for email prioritization, task tracking, and reply generation.

## AI Model

- Provider: NVIDIA
- Model: `nvidia/nemotron-3.5-lightning-30b-a3b`

## Analysis Objectives

The AI is expected to identify:

| Field | Description |
|---|---|
| Category | Type or classification of the email |
| Priority | Urgency of the email |
| Summary | Concise summary of the email |
| Action Items | Tasks or actions requested in the email |
| Deadline | Any deadline explicitly mentioned |
| Requires Reply | Whether a response appears necessary |
| Sentiment | General tone of the email |

## Prompt Used

> Replace this section with the exact email-analysis prompt used in your Make scenario.

The prompt should instruct the AI to:

- Analyze the email based on its content.
- Categorize the email.
- Determine its priority.
- Summarize the email.
- Identify action items.
- Extract deadlines only when supported by the email.
- Determine whether a reply is required.
- Identify the email's sentiment.
- Return the output in the expected JSON format.

## Expected Output

The AI response is expected to be structured JSON containing the extracted email information.

Example of the expected structure:

```json
{
  "category": "Meeting",
  "priority": "High",
  "summary": "The sender is requesting confirmation for an upcoming meeting.",
  "action_items": "Confirm meeting attendance.",
  "deadline": "24 November 2026",
  "requires_reply": true,
  "sentiment": "Neutral"
}
```

> The example above is illustrative and does not represent an actual model response.

## Integration

The AI-generated output is passed to a JSON parsing module in Make.

Parsed fields are subsequently mapped to the corresponding columns in Google Sheets.

## Notes

The prompt and its output format should remain consistent with the Make scenario. Prompt injection protection, output validation, and strict handling of untrusted email content are planned security improvements.
