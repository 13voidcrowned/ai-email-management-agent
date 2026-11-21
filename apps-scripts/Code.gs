const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'YOUR_SHEET_NAME';

// Column positions (1-based)
const COL_EMAIL_ID = 1;
const COL_THREAD_ID = 2;
const COL_RECEIVED_AT = 3;
const COL_SENDER_NAME = 4;
const COL_SENDER_EMAIL = 5;
const COL_SUBJECT = 6;
const COL_EMAIL_CONTENT = 7;
const COL_CATEGORY = 8;
const COL_PRIORITY = 9;
const COL_SUMMARY = 10;
const COL_ACTION_ITEMS = 11;
const COL_DEADLINE = 12;
const COL_REQUIRES_REPLY = 13;
const COL_SENTIMENT = 14;
const COL_REPLY_DRAFT = 15;
const COL_APPROVAL_STATUS = 16;
const COL_PROCESSED_AT = 17;

// =========================
// WEB APP
// =========================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('AI Email Management Agent')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

// =========================
// AUTHORIZATION HELPER
// Run this manually from the Apps Script editor once to trigger Gmail consent.
// It does NOT send an email or modify any Gmail message.
// =========================

function authorizeGmail() {
  // GmailApp operations trigger the Gmail authorization flow when run manually.
  GmailApp.getInboxThreads(0, 1);
  GmailApp.getAliases();
  Logger.log('Gmail authorization check completed.');
}

// =========================
// READ EMAILS
// =========================

function getEmails() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 17).getValues();
  const recordsById = new Map();

  values.forEach((row, index) => {
    const emailId = String(row[COL_EMAIL_ID - 1] || '').trim();
    if (!emailId) return;

    const record = {
      'Email ID': emailId,
      'Thread ID': String(row[COL_THREAD_ID - 1] || ''),
      'Received At': formatValue_(row[COL_RECEIVED_AT - 1]),
      'Sender Name': String(row[COL_SENDER_NAME - 1] || ''),
      'Sender Email': String(row[COL_SENDER_EMAIL - 1] || ''),
      'Subject': String(row[COL_SUBJECT - 1] || ''),
      'Email Content': String(row[COL_EMAIL_CONTENT - 1] || ''),
      'Category': String(row[COL_CATEGORY - 1] || ''),
      'Priority': String(row[COL_PRIORITY - 1] || ''),
      'Summary': String(row[COL_SUMMARY - 1] || ''),
      'Action Items': row[COL_ACTION_ITEMS - 1] || '',
      'Deadline': String(row[COL_DEADLINE - 1] || ''),
      'Requires Reply': row[COL_REQUIRES_REPLY - 1],
      'Sentiment': String(row[COL_SENTIMENT - 1] || ''),
      'Reply Draft': String(row[COL_REPLY_DRAFT - 1] || ''),
      'Approval Status': String(row[COL_APPROVAL_STATUS - 1] || 'Pending'),
      'Processed At': formatValue_(row[COL_PROCESSED_AT - 1]),
      '_rowNumber': index + 2
    };

    recordsById.set(emailId, record);
  });

  return Array.from(recordsById.values()).sort((a, b) => b._rowNumber - a._rowNumber);
}

// =========================
// SAVE DRAFT
// =========================

function saveReplyDraft(emailId, replyDraft) {
  if (!emailId || typeof replyDraft !== 'string') {
    throw new Error('Email ID and draft are required.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_();
    const row = findLatestEmailRow_(sheet, emailId);
    if (!row) throw new Error('Email record not found.');

    const status = normalizeStatus_(sheet.getRange(row, COL_APPROVAL_STATUS).getValue());
    if (status === 'sent' || status === 'sending') {
      throw new Error('This email cannot be edited right now.');
    }

    sheet.getRange(row, COL_REPLY_DRAFT).setValue(replyDraft);
    sheet.getRange(row, COL_APPROVAL_STATUS).setValue('Pending');
    sheet.getRange(row, COL_PROCESSED_AT).setValue(new Date());
    SpreadsheetApp.flush();

    return { success: true, message: 'Draft saved successfully.' };
  } finally {
    lock.releaseLock();
  }
}

// =========================
// REJECT EMAIL
// =========================

function rejectEmail(emailId) {
  if (!emailId) throw new Error('Missing Email ID.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_();
    const row = findLatestEmailRow_(sheet, emailId);
    if (!row) throw new Error('Email record not found.');

    const status = normalizeStatus_(sheet.getRange(row, COL_APPROVAL_STATUS).getValue());
    if (status === 'sent' || status === 'sending') {
      throw new Error('This email cannot be rejected.');
    }

    sheet.getRange(row, COL_APPROVAL_STATUS).setValue('Rejected');
    sheet.getRange(row, COL_PROCESSED_AT).setValue(new Date());
    SpreadsheetApp.flush();

    return { success: true, message: 'Email rejected successfully.' };
  } finally {
    lock.releaseLock();
  }
}

// =========================
// SEND REPLY IN ORIGINAL THREAD
// =========================

function sendApprovedEmail(emailId, editedReply) {
  if (!emailId || typeof editedReply !== 'string' || !editedReply.trim()) {
    throw new Error('Email ID and reply content are required.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_();
    const row = findLatestEmailRow_(sheet, emailId);
    if (!row) throw new Error('Email record not found.');

    const status = normalizeStatus_(sheet.getRange(row, COL_APPROVAL_STATUS).getValue());
    if (status === 'sent' || status === 'sending') {
      throw new Error('This email has already been sent or is being sent.');
    }
    if (status !== 'pending' && status !== 'send failed') {
      throw new Error('Only pending emails can be sent.');
    }

    const threadId = String(sheet.getRange(row, COL_THREAD_ID).getValue() || '').trim();
    const recipient = String(sheet.getRange(row, COL_SENDER_EMAIL).getValue() || '').trim();
    if (!threadId) throw new Error('Original Gmail Thread ID is missing.');
    if (!recipient || !recipient.includes('@')) throw new Error('Invalid recipient email address.');

    // Persist the draft and reserve this record against duplicate concurrent sends.
    sheet.getRange(row, COL_REPLY_DRAFT).setValue(editedReply);
    sheet.getRange(row, COL_APPROVAL_STATUS).setValue('Sending');
    sheet.getRange(row, COL_PROCESSED_AT).setValue(new Date());
    SpreadsheetApp.flush();

    try {
      const thread = GmailApp.getThreadById(threadId);
      if (!thread) throw new Error('Original Gmail thread could not be found.');

      // Reply in the original thread only. There is no fallback to a new message.
      thread.reply(editedReply);

      sheet.getRange(row, COL_APPROVAL_STATUS).setValue('Sent');
      sheet.getRange(row, COL_PROCESSED_AT).setValue(new Date());
      SpreadsheetApp.flush();

      return { success: true, message: 'Reply sent successfully in the original Gmail thread.' };
    } catch (sendError) {
      sheet.getRange(row, COL_APPROVAL_STATUS).setValue('Send Failed');
      sheet.getRange(row, COL_PROCESSED_AT).setValue(new Date());
      SpreadsheetApp.flush();
      throw new Error('Reply failed: ' + sendError.message);
    }
  } finally {
    lock.releaseLock();
  }
}

// =========================
// INTERNAL HELPERS
// =========================

function getSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID' || SPREADSHEET_ID === 'PASTE_YOUR_SPREADSHEET_ID_HERE') {
    throw new Error('Please configure SPREADSHEET_ID in Code.gs.');
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found: ' + SHEET_NAME);
  return sheet;
}

function findLatestEmailRow_(sheet, emailId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const ids = sheet.getRange(2, COL_EMAIL_ID, lastRow - 1, 1).getDisplayValues();
  const target = String(emailId).trim();

  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]).trim() === target) return i + 2;
  }
  return null;
}

function normalizeStatus_(value) {
  return String(value || 'Pending').trim().toLowerCase();
}

function formatValue_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  }
  return String(value == null ? '' : value);
}

// Diagnostic function
function diagnoseDashboard() {
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  Logger.log('Spreadsheet: ' + sheet.getParent().getName());
  Logger.log('Sheet: ' + sheet.getName());
  Logger.log('Records: ' + Math.max(data.length - 1, 0));
}