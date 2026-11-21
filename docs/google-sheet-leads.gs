/**
 * GrowWWW - website leads to Google Sheet.
 * Paste this whole file into the sheet's Extensions -> Apps Script, then Deploy -> New deployment -> Web app
 * (Execute as: Me, Who has access: Anyone). Copy the web app URL into Supabase as GOOGLE_SHEET_WEBHOOK_URL.
 * The secret below must match the GOOGLE_SHEET_SECRET secret in Supabase.
 */
const SECRET = "PASTE-THE-SAME-VALUE-AS-GOOGLE_SHEET_SECRET";
const SHEET_ID = "13YmI2Vqn_bAcEYIqvzwl7QuJl3o5oC9zJONUi2iDAjg";
const TAB = "Leads";
const HEADERS = ["Date (IST)", "Name", "Phone", "Email", "Company", "Service", "Budget", "Message", "Page", "Status", "Follow-up notes"];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "Bad request" });
  }
  if (data.secret !== SECRET) return reply({ ok: false, error: "Wrong secret - check GOOGLE_SHEET_SECRET in Supabase" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet();
    sheet.appendRow([
      data.date, data.name, data.phone, data.email, data.company, data.service,
      data.budget, data.message, data.source_page, data.status, "",
    ].map(safe));
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

/** Opening the web app URL in a browser just confirms it's live. */
function doGet() {
  return reply({ ok: true, message: "GrowWWW leads web app is running." });
}

function getSheet() {
  const book = SpreadsheetApp.openById(SHEET_ID);
  let sheet = book.getSheetByName(TAB);
  if (!sheet) {
    sheet = book.getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.setName(TAB);
    else sheet = book.insertSheet(TAB);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#1a1712").setFontColor("#e8c27a");
    sheet.setFrozenRows(1);
    [150, 160, 130, 200, 150, 170, 100, 380, 160, 80, 220].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
    sheet.getRange("H:H").setWrap(true);
  }
  return sheet;
}

// Stops text like "=..." or "+91..." being read as a formula, and keeps cells a sensible size.
function safe(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).slice(0, 4000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor (select it, press Run) to create the header row and approve access. */
function setup() {
  getSheet();
}
