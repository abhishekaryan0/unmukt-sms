# SMS Unmukt (smsunmukt)
### SMS & WhatsApp Marketing SaaS Platform for Indian Businesses & Agencies

A modern, production-grade B2B SaaS frontend built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide React**, and **Recharts**.

Designed specifically for Indian small businesses, retail shops, coaching institutes, restaurants, and digital marketing agencies.

---

## 🌟 Key Architecture & Features

### 1. Dual Independent Dashboards
The platform has **two completely separate portals** with their own layouts, route guards, navigation systems, and user journeys:

#### A. Super Admin Control Plane (`/admin/login` → `/admin/dashboard`)
* **Purpose**: For platform owners and telecom gateway administrators.
* **Navigation Modules**:
  1. **Dashboard** (`/admin/dashboard`): Top statistics in INR (Total Customers, Active Businesses, Messages Sent, Revenue, Platform Profit, 99.4% Delivery SLA), daily switch volume charts, revenue vs wholesale expense charts, and supplier health.
  2. **Customer Management** (`/admin/customers` & `/admin/customers/[id]`): Detailed customer list with tabs: Overview, Campaigns, Wallet, Transactions, Contacts, and Activity Log. Includes instant Activate/Suspend toggles and manual wallet credit/debit adjustments.
  3. **Agency Management** (`/admin/agencies`): Reseller partner management with managed sub-accounts, custom wholesale pricing tiers, and agency wallet ledgers.
  4. **Campaigns Management** (`/admin/campaigns`): Global audit log of all SMS and WhatsApp broadcasts.
  5. **SMS Management** (`/admin/sms`): Promotional vs Transactional breakdown, DLT statistics, and carrier message log.
  6. **WhatsApp Management** (`/admin/whatsapp`): Meta Cloud API conversation categorization (Marketing, Utility, Authentication), Meta charges vs customer charges, and delivery telemetry.
  7. **Suppliers** (`/admin/suppliers`): Upstream carriers (EJOIN EIMS, Route Mobile, Tanla Platforms, Meta Cloud API) with TPS capacity, endpoints, wholesale unit costs, and configuration modal.
  8. **Routing Engine** (`/admin/routing`): Multi-tier dynamic carrier rules engine (priority, failover switches, conditions, wholesale price).
  9. **Wallet & Transactions** (`/admin/wallet`): Complete platform ledger with manual credit/debit tool.
  10. **Pricing Management** (`/admin/pricing`): Customer tariff configuration with real-time gross margin calculation.
  11. **Revenue & Billing** (`/admin/billing`): Platform P&L statement, carrier wholesale costs reconciliation, and 18% GST (CGST 9% + SGST 9%) tax summary under HSN 998413.
  12. **Reports & Analytics** (`/admin/reports`): Customer growth, volume trends, and CSV exports.
  13. **Templates Registry** (`/admin/templates`): Regulatory compliance review (Approve/Reject customer templates).
  14. **Support Tickets** (`/admin/support`): Customer inquiry desk with interactive conversation threads and operator replies.
  15. **Settings** (`/admin/settings`): Platform parameters, Airtel DLT integration node, and 1-click factory demo data reset.

---

#### B. Client Marketing Dashboard (`/login` → `/dashboard`)
* **Purpose**: Tailored for non-technical Indian shopkeepers, coaching centers, and business owners.
* **Navigation Modules**:
  1. **Dashboard** (`/dashboard`): Available prepaid balance in INR, quick campaign launchers, daily broadcast charts, and delivery rates.
  2. **Send SMS Wizard** (`/send-sms`): 5-step guided wizard:
     - **Step 1**: Campaign Info, SMS Type (Promotional / Transactional), Sender Header (`SHRFSH`), DLT Template selector.
     - **Step 2**: Recipient selection from groups, Excel/CSV file upload, and manual input with Indian mobile number validation (+91) and automatic duplicate scrubbing.
     - **Step 3**: Message composer with dynamic character counter, GSM 7-bit (160/153) vs Unicode (70/67) auto-detection, credit segment estimator, and real-time mobile screen mockup.
     - **Step 4**: Cost summary (credits × rate) with wallet balance validation.
     - **Step 5**: Immediate or scheduled dispatch confirmation dialog.
  3. **WhatsApp Campaigns** (`/whatsapp`): WhatsApp broadcast builder with Meta-approved templates, live variable substitution (`{{1}}`, `{{2}}`), header image previews, interactive CTA buttons ("Shop Online", "Call Store"), and chat mockup.
  4. **Contacts** (`/contacts`): Full customer phonebook with Indian mobile formatting, group filtering, tags, consent tracking (TRAI & Meta policy), CSV import/export, and details modal.
  5. **Contact Groups** (`/groups`): Segmentation into VIP Customers, Festival Offers, Regular Customers, New Walk-ins, etc.
  6. **Campaign History** (`/campaigns`): Past broadcasts with delivery funnels (Submitted, Delivered, Failed) and detailed inspect modal.
  7. **Templates** (`/templates`): Ready-made Indian business templates (Diwali mega sale, new arrivals, fee reminders, table reservations) + custom template submission.
  8. **Prepaid Wallet & Recharge** (`/wallet`): Quick recharge packs (₹499, ₹999, ₹1,999, ₹4,999, Custom) with instant checkout simulation (UPI/QR, Net Banking, Card) and 18% GST tax calculation.
  9. **Transactions** (`/transactions`): Ledger of wallet credits and campaign debits with CSV statement download.
  10. **Invoices** (`/invoices`): Compliant Indian GST Tax Invoices (with CGST, SGST, HSN 998413, business details, and browser print/save PDF capability).
  11. **Reports** (`/reports`): Daily delivery ratios and message consumption charts.
  12. **Support** (`/support`): Create tickets for DLT headers or Meta templates, view conversation threads, and post replies.
  13. **Profile & Settings** (`/settings`): Business information, GSTIN, DLT Entity ID, and notification preferences.

---

## 🔑 Demo Login Credentials

### Super Admin Portal
* **URL**: [`/admin/login`](http://localhost:3000/admin/login)
* **Email**: `admin@messagehub.in`
* **Password**: `Admin@123`
* *(Includes a 1-Click Auto-Fill button on the login screen)*

### Client Portal
* **URL**: [`/login`](http://localhost:3000/login)
* **Email**: `demo@messagehub.in`
* **Password**: `Demo@123`
* *(Account: Rajesh Sharma – Sharma Fashion Store, Chandni Chowk, Delhi)*

---

## 🛠️ Technology Stack
* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Design Inspiration**: Stripe Dashboard, Linear, Vercel
* **Icons**: Lucide React
* **Charts**: Recharts
* **State Management**: React Context + `localStorage` persistence

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

To run a production build:
```bash
npm run build
npm run start
```
