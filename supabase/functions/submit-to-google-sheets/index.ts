import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp?: string;
  sheetName?: string;
}

const base64url = (str: string) =>
  btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/g, '');

function extractSpreadsheetId(input: string): string {
  try {
    if (input.includes('http')) {
      const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) return match[1];
    }
    return input;
  } catch {
    return input;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contactData: ContactData = await req.json();
    console.log('Received contact data:', contactData);

    // Get credentials from environment
    const credentialsJson = Deno.env.get('GOOGLE_SHEETS_CREDENTIALS');
    const rawSheetId = Deno.env.get('GOOGLE_SHEET_ID') || '';

    if (!credentialsJson || !rawSheetId) {
      throw new Error('Missing Google Sheets credentials or sheet ID');
    }

    const sheetId = extractSpreadsheetId(rawSheetId);
    const credentials = JSON.parse(credentialsJson);

    // Create JWT for Google API authentication
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // Encode header and claim (base64url)
    const encodedHeader = base64url(JSON.stringify(header));
    const encodedClaim = base64url(JSON.stringify(claim));
    const signatureInput = `${encodedHeader}.${encodedClaim}`;

    // Import private key and sign
    const privateKey = credentials.private_key;
    const keyData = privateKey
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\s/g, '');
    
    const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryKey,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      encoder.encode(signatureInput)
    );

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const jwt = `${encodedHeader}.${encodedClaim}.${encodedSignature}`;

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token error:', errorText);
      throw new Error('Failed to get access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Append data to Google Sheet
    const timestamp = contactData.timestamp || new Date().toISOString();
    const row = [
      timestamp,
      contactData.name,
      contactData.email,
      contactData.phone || '',
      contactData.message,
    ];

    const sheetName = contactData.sheetName && contactData.sheetName.trim() !== '' ? contactData.sheetName : 'GrowWWW';
    console.log('Using sheet name:', sheetName);
    console.log('Contact data received:', JSON.stringify(contactData, null, 2));
    const targetRange = `${sheetName}!A:E`;
    console.log('Target range:', targetRange);

    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(targetRange)}:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );

    if (!appendResponse.ok) {
      const errorText = await appendResponse.text();
      console.error('Sheets API error:', errorText);
      throw new Error('Failed to append to Google Sheet');
    }

    const result = await appendResponse.json();
    console.log('Successfully added to Google Sheet:', result);

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in submit-to-google-sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
