# Matoshri Anandashram — Visitor & Bhojan Seva Portal

## 🚀 Quick Start

### Step 1: Run the Database Schema

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open `SCHEMA.sql` and paste the entire content
3. Click **Run** — this creates all 6 tables with proper security policies

### Step 2: Create Admin User

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **Invite User** or **Add User**
3. Enter your admin email and set a password
4. Then run this in SQL Editor:
   ```sql
   INSERT INTO admins (email, name, role) 
   VALUES ('your-admin@email.com', 'Your Name', 'admin');
   ```

### Step 3: Deploy to Vercel

**Option A — GitHub (Recommended):**
1. Upload this project folder to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Select the repo → Click **Deploy** (no env vars needed — credentials are in the code)

**Option B — Vercel CLI:**
```bash
npm install -g vercel
cd matoshri-anandashram
npm install
vercel --prod
```

### Step 4: Access Admin Panel

- Go to `yoursite.vercel.app/admin/login`
- Use the email/password you created in Step 2

---

## 📁 File Structure

```
src/
├── lib/
│   └── supabase.js          # Supabase client + ORG config
├── pages/
│   ├── Landing.js           # Homepage with hero, about, gallery, contact
│   ├── VisitorForm.js       # Visitor registration form
│   ├── VisitorThankYou.js   # Thank you page after registration
│   ├── BhojanSeva.js        # Donation form + WhatsApp redirect
│   ├── AdminLogin.js        # Admin authentication
│   └── AdminDashboard.js    # Admin shell with sidebar
├── components/
│   ├── AdminOverview.js     # Dashboard stats + birthdays + upcoming
│   ├── AdminVisitors.js     # Visitor database + export
│   ├── AdminDonations.js    # Donation database + status management
│   └── AdminReceipts.js     # PDF receipt generator
├── App.js                   # Routing
└── App.css                  # Global styles (premium NGO theme)
```

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `visitors` | All visitor registrations |
| `donations` | Bhojan Seva donation requests |
| `receipts` | Generated receipts |
| `volunteers` | Volunteer interest records |
| `admins` | Admin user records |
| `activity_logs` | Audit trail |

---

## 🌐 Application Routes

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/register` | Visitor registration form |
| `/thank-you` | Post-registration thank you |
| `/bhojan-seva` | Bhojan Seva donation form |
| `/admin/login` | Admin login |
| `/admin` | Dashboard overview |
| `/admin/visitors` | Visitor database |
| `/admin/donations` | Donation management |
| `/admin/receipts` | Receipt generator |

---

## 📱 QR Code Setup

Generate a QR code pointing to:
- `https://yoursite.vercel.app/register` — for visitor registration
- `https://yoursite.vercel.app` — for the full portal

Use any free QR generator like [qr-code-generator.com](https://www.qr-code-generator.com/)

---

## 🔧 Customisation

To update organisation details, edit `src/lib/supabase.js`:
```js
export const ORG = {
  name: 'Matoshri Anandashram',
  address: 'Savkheda Shivar, Tal & Dist. Jalgaon',
  phone1: '0257 2281327',
  phone2: '9423574806',
  whatsapp: '919004184333',  // ← WhatsApp number for Bhojan Seva
  mapUrl: 'https://maps.app.goo.gl/...',
};
```

---

## 🛡️ Security Notes

- Admin routes are protected by Supabase Auth
- Visitor/donation forms are public (by design — anyone can register)
- Row Level Security (RLS) is enabled on all tables
- Only authenticated admins can read/update/delete records
- Passwords are managed by Supabase Auth (bcrypt encrypted)

---

Built with ❤️ for Matoshri Anandashram, Jalgaon
