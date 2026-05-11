// =============================================================
// Wolf Carports - Pizarrón API (Google Apps Script)
//
// Handles BOTH reading data and writing Contactado back to the
// Google Sheet. Runs as the sheet owner so no public sharing
// or API key is needed.
//
// DEPLOYMENT:
// 1. Open the Google Sheet in your browser
// 2. Go to Extensions > Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Deploy > New Deployment
// 5. Type: Web App
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Click Deploy and copy the URL
// 9. Paste the URL into index.html CONFIG.APPS_SCRIPT_URL
// =============================================================

const SPREADSHEET_ID = '1X9OxDWLFsgQMer7v52A5zIAdbzm11l30OvCG1JP7Ozw';

function doGet(e) {
  var params = e.parameter;

  // --- Read data for a caller tab ---
  if (params.action === 'getData') {
    try {
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      var sheet = ss.getSheetByName(params.caller);
      if (!sheet) {
        return createJsonResponse({ status: 'error', message: 'Tab not found: ' + params.caller });
      }
      var lastRow = sheet.getLastRow();
      if (lastRow < 1) {
        return createJsonResponse({ status: 'ok', values: [] });
      }
      var data = sheet.getRange(1, 1, lastRow, 6).getValues();
      return createJsonResponse({ status: 'ok', values: data });
    } catch (error) {
      return createJsonResponse({ status: 'error', message: error.toString() });
    }
  }

  // --- Mark a row as contacted ---
  if (params.action === 'markContacted') {
    try {
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      var sheet = ss.getSheetByName(params.caller);
      var row = parseInt(params.row);
      var value = params.value || 'Yes';

      if (!sheet) {
        return createJsonResponse({ status: 'error', message: 'Tab not found: ' + params.caller });
      }
      if (row < 2) {
        return createJsonResponse({ status: 'error', message: 'Invalid row: ' + row });
      }

      sheet.getRange(row, 6).setValue(value);
      Logger.log('Contactado: ' + params.caller + ' row ' + row + ' = ' + value);

      return createJsonResponse({
        status: 'ok',
        message: 'Row ' + row + ' in ' + params.caller + ' marked as ' + value
      });
    } catch (error) {
      return createJsonResponse({ status: 'error', message: error.toString() });
    }
  }

  // --- Health check ---
  return createJsonResponse({
    status: 'ok',
    message: 'Pizarron API is running',
    timestamp: new Date().toISOString()
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
