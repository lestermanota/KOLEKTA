# KOLEKTA

A class fund app that works offline. Treasurers scan student QR codes to record payments and expenses, and students use a portal to check their balance and pay by GCash or bank transfer.

It is a static web app (`index.html`) that you host on GitHub Pages, plus a Google Sheet with an Apps Script backend that stores the data.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app: treasurer screens, student portal, and the backend code (Code.gs) kept inside it so both stay in sync |
| `sw.js` | Service worker. Makes the app work offline. **Change the `kolekta-vNN` name every time you upload a new `index.html`** so phones pick up the update |
| `manifest.json` | Lets people install the app on their home screen |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | App icons |
| `receipt-mascot.png` | Mascot artwork |

## First-time setup

1. Create a Google Sheet. Open **Extensions > Apps Script**.
2. In the app, open **Settings > Backend code**, copy the code, and paste it into Apps Script (replace everything).
3. Run `setup()` once and approve the permissions (Sheets, Drive, Gmail/Mail, triggers).
4. **Deploy > New deployment > Web app.** Execute as *Me*, access *Anyone*. Copy the `/exec` URL.
5. Paste that URL into `API_URL` near the top of `index.html`.
6. Upload all files to your GitHub Pages repo.

## Updating

1. Upload the new `index.html` and `sw.js` (with a new cache version).
2. Copy the backend code from the app again into Apps Script.
3. **Deploy > Manage deployments > Edit > New version.** If you skip this, new features that need the backend will not work.
4. If the app says the backend is outdated, repeat steps 2 and 3.

## Roles

- **Admin**: everything, including approving student payments, voiding or editing payments, settings, PIN resets, exemptions and the activity log.
- **Treasurer**: records payments and expenses, scans QR codes and views reports.

## Treasurer features

- Scan a student's ID QR to record a payment (cash, GCash or bank, with proof photo).
- Expenses with photos, class fund balance, reports, charts and a closing report.
- Receipts with a verification QR. A receipt email is sent **15 minutes after** a payment so you can still edit or void it. A voided payment never sends an email.
- Weekly reminder emails to students who still owe, with a link to the portal.
- **Student payments** (More menu, admin only): approve or reject what students submit. A red number on **More** shows how many are waiting. **Approve all clean** approves everything that is not flagged.
- A flag appears when a student uploads the same screenshot as an earlier submission.
- **Exempt from a collection** (student profile, admin only): the collection is removed from what that student owes.
- **Portal settings** (More menu, admin only): an announcement for students, and a switch to show the class fund summary.
- **Copy student portal link**: share it with the class.

## Student portal

Open `your-site/?p=1`.

- Sign in with Student ID and PIN. The first PIN is `0000` and must be changed right away (4 to 8 digits).
- Forgot PIN: a 6-digit code is emailed to the address saved on the student. No email saved? The admin can reset the PIN to `0000`.
- Students stay signed in for 90 days on their phone until they sign out. Changing or resetting the PIN signs them out everywhere.
- Tabs: **Home** (what is left, per collection), **Fund** (class fund and expenses, if enabled), **Pay**, **History** (submissions, receipts you can save as an image), **Settings**.
- To pay: send the money by GCash or bank, then fill in name on the account, account number, reference number and a screenshot. The payment shows as pending until the admin approves it.
- The same reference number cannot be used twice. A student can have at most 5 pending payments.
- Works offline for viewing. It shows the last data it received, marked with the time. Paying needs internet.

## Where data lives

- Google Sheet tabs: Students, Collections, Transactions, Expenses, Settings, Student Balances, Submissions (student payments), Portal (hashed PINs), Exempt, Admin Logs.
- Payment and receipt photos: a private Drive folder named *KOLEKTA Proofs*.
- Nothing is stored on a third-party server.

## Privacy and security

- Student names and IDs are personal data. Only share the sheet with people who need it, and keep the portal link inside the class.
- PINs are stored as signed hashes, never as plain text. Six wrong tries lock a student out for 10 minutes.
- A student can only ever see their own records, plus the class fund totals if the admin turns that on (no student names).
- Anyone with the Drive folder or the Sheet link can see data, so keep both private.

## Troubleshooting

- **Nothing changed after uploading**: bump the number in `sw.js`, then close and reopen the app (or clear the site data).
- **Portal says "Wrong student ID or PIN" for everyone**: the backend was not redeployed as a new version.
- **Emails are not arriving**: check the student has an email saved, the Apps Script quota (about 100 emails a day on a free account), and the Executions log.
- **A payment is stuck as pending in the app**: open Settings and tap Sync now while online.
