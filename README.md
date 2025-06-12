# FundPay 💸 – Best Funding Web App

FundPay is a full-stack fundraising platform where users can contribute to campaigns, and admins can manage and verify donations. The project features secure authentication, payment tracking, dynamic campaign management, and real-time receipt generation.

---

## 🔐 Authentication

- Two types of logins:
  - **User Login** – for donors
  - **Admin Login** – for campaign managers
- Users and admins are redirected to separate dashboards post-login.

---

## 🧭 Dashboard & Navigation

- The app features a responsive **navbar** with:
  - Logo (`FundPay`)
  - Search bar for campaigns
  - Contact Us link
  - User profile/avatar
  - Logout button
- **Admins** see an extra:
  - `➕ Add Campaign` button
  - 🔔 `Notification Bell` to verify pending payments

---

## 📢 Campaign Listings

- Campaigns are displayed with:
  - Thumbnail image
  - Short title & description
  - Progress (target vs collected)
- Clicking on a campaign opens its detail view with:
  - Full description
  - Target and current raised amount
  - Pay button

---

## 💰 Payment Flow

- Users click **Pay**, and a modal shows:
  - QR Code
  - UPI ID
  - Bank account details
  - File upload for payment screenshot
  - Input for paid amount
- After submission:
  - The payment goes to verification.
  - Users are redirected back to the dashboard.

---

## 🧑‍💼 Admin Features

- **Add Campaign**:
  - Form with fields:
    - Title, description, target amount
    - Thumbnail (required)
    - QR code (optional)
    - UPI & Bank Details (optional)
- **Verify Payments**:
  - Admin sees a list of pending payments with:
    - Screenshot
    - Amount
    - Donor name
  - Can either:
    - ✅ Verify – adds the amount to the campaign
    - ❌ Reject – discards the transaction
- **Receipts**:
  - Automatically generated for each verified payment
  - Users can view/download PDF receipts

---

## 🛠️ Tech Stack

**Frontend**:
- React
- TailwindCSS
- Framer Motion
- React Icons
- React Router

**Backend**:
- Node.js
- Express
- MongoDB
- Multer (file uploads)
- JWT (authentication)

---

## 🖼️ Project Images 

![Screenshot (142)](https://github.com/user-attachments/assets/dd24c1c9-21a6-437b-87f2-c5c1807a2334)
![Screenshot (143)](https://github.com/user-attachments/assets/c4ce8d11-05ed-44ff-ae87-76eacdc1815a)
![Screenshot (144)](https://github.com/user-attachments/assets/e81a49f1-a119-477f-b9a4-fdf3a81a9f06)
![Screenshot (145)](https://github.com/user-attachments/assets/dc01e7b6-77da-4cbe-9de2-b9cbd65d637c)
![Screenshot (146)](https://github.com/user-attachments/assets/24e9a398-ceff-4623-ad99-2c34f072df83)
![Screenshot (147)](https://github.com/user-attachments/assets/091c8c24-1538-4bf2-a519-36c25b27b220)
![Screenshot (148)](https://github.com/user-attachments/assets/4ba868eb-88c8-4455-9223-2df9902ae1c8)
![Screenshot (149)](https://github.com/user-attachments/assets/047e566a-c2fc-42be-a828-298516fecf05)
![Screenshot (150)](https://github.com/user-attachments/assets/1b2deff9-79ae-4182-ac85-1947f4b01ddb)

![Screenshot (152)](https://github.com/user-attachments/assets/952fdec2-1d55-4ccb-987c-90463b2a5a31)

![Screenshot (153)](https://github.com/user-attachments/assets/5154c63a-0b93-42f7-9b94-d52d4a7fd5eb)

![Screenshot (154)](https://github.com/user-attachments/assets/9e289d08-2664-45cc-8cbd-f34a91e5ff43)
![Screenshot (155)](https://github.com/user-attachments/assets/b6ca857b-da32-4646-9d4e-3ff453aad5ac)

