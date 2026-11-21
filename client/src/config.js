// =========================================================================
// DEEPATHOON SITE CONFIGURATION
// =========================================================================

/**
 * GOOGLE APPS SCRIPT WEB APP URL
 * 
 * To connect your personal Google Sheet:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Extensions > Apps Script
 * 3. Paste the script from 'google-sheets-script.js'
 * 4. Deploy > New Deployment > Web App (Who has access: Anyone)
 * 5. Paste the resulting Web App URL below:
 */
export const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwYOUR_SCRIPT_ID_HERE/exec'

// Cloud KV persistent counter endpoints (monotonically protected)
export const CLOUD_KV_GET = 'https://keyvalue.immanuel.co/api/KeyVal/GetValue/rt4i17ti/deepathoon_count'
export const CLOUD_KV_SET = 'https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/rt4i17ti/deepathoon_count/'
