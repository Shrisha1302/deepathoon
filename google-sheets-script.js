/**
 * =========================================================================
 * DEEPATHOON DEVOTEE DATA BANK — GOOGLE APPS SCRIPT
 * =========================================================================
 * This Google Apps Script receives devotee email registrations from
 * Deepathoon.com and automatically appends them to your Google Spreadsheet.
 *
 * NO DATABASE REQUIRED — All visitor data goes directly to Google Sheets!
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 5-MINUTE STEP-BY-STEP SETUP GUIDE:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Open your browser and go to: https://sheets.new
 *    (This opens a brand new Google Spreadsheet in your Google Drive).
 * 2. Rename the spreadsheet to: "Deepathoon Devotee Data Bank"
 * 3. In the top menu, click: Extensions -> Apps Script
 * 4. In the code editor that opens, DELETE any existing code inside Code.gs
 * 5. PASTE THIS ENTIRE FILE into Code.gs
 * 6. Click the SAVE icon (Floppy disk or Ctrl+S).
 * 7. Click the blue "Deploy" button (top right) -> "New deployment"
 * 8. Click the Gear icon (Select type) -> Choose "Web app"
 * 9. Configure the deployment settings:
 *    - Description: Deepathoon Devotees
 *    - Execute as: "Me (your_email@gmail.com)"
 *    - Who has access: "Anyone"  <=== (CRITICAL: MUST SELECT "Anyone")
 * 10. Click "Deploy" (Grant permissions if Google asks).
 * 11. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 12. Paste that URL into `client/src/config.js` or in the site config!
 *
 * That's it! Every time a devotee enters their email, a new row is
 * instantly added with their Email, City, State, Country, IP, and Time!
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds to safely handle concurrent devotee registrations
  lock.tryLock(30000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create and style header row if the sheet is blank
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)",
        "Email Address",
        "City",
        "State / Region",
        "Country",
        "IP Address",
        "Device Type",
        "Timezone",
        "Source Page"
      ]);

      // Sacred Golden Header Row Styling
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground("#D97706");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setFontFamily("Arial");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Parse incoming devotee data
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, hh:mm:ss a") + " IST";
    var email     = data.email ? data.email.toString().trim().toLowerCase() : "";
    var city      = data.city || "Unknown";
    var region    = data.region || "Unknown";
    var country   = data.country || "Unknown";
    var ip        = data.ip || "Unknown";
    var device    = data.device || "Unknown";
    var timezone  = data.timezone || "Asia/Kolkata";
    var pageUrl   = data.pageUrl || data.url || "https://deepathoon.com";

    // Validate email presence before writing
    if (email && email.indexOf("@") !== -1) {
      sheet.appendRow([
        timestamp,
        email,
        city,
        region,
        country,
        ip,
        device,
        timezone,
        pageUrl
      ]);

      // Set cell alignments
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
      sheet.getRange(lastRow, 2).setHorizontalAlignment("left");
      sheet.getRange(lastRow, 3, 1, 7).setHorizontalAlignment("center");

      // Auto-resize columns
      sheet.autoResizeColumns(1, 9);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Devotee recorded in Google Sheet" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Deepathoon Devotee Data Bank Webhook is active and listening! 🙏")
    .setMimeType(ContentService.MimeType.TEXT);
}
