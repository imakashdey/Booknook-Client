# 📚 BookNook – A Small Online Library

**BookNook** is a cozy, modern online community library designed around a delightfully simple philosophy: **“Add a book, borrow a book, return a book.”** Readers can explore shared titles, list their own books, borrow available copies for a 7-day loan period, and track active loans with zero fuss.

- 🌐 **Live Website URL:** [https://booknook-client-sandy.vercel.app](https://booknook-client-sandy.vercel.app)
- 🎨 **Color Hunt Palette:** `#FEFAF3` (Paper Cream), `#F6E2E9` (Blush Rose), `#B8CFB3` (Soft Sage), `#84A282` (Deep Forest Sage)

---

## 🌟 Key Features (Minimum 5 Highlights)

1. **Community-Driven Book Cataloging & Real-Time Availability:**
   Authenticated readers can list new books with cover images, title, author, category, short descriptions, and initial copies. Available copy counts automatically update in real-time upon borrowing and returning.

2. **Smart 7-Day Borrowing & Return System:**
   Inspect book details, check real-time stock, and confirm a 7-day loan with a single click. Borrowed books are tracked under `My Borrows` with due dates, and returning a book instantly replenishes community stock.

3. **No Double Borrow & Stock Protection (Challenge Met):**
   Prevents double borrowing — readers cannot borrow the same book simultaneously if they already have an active loan. When copies reach 0, the borrow button is automatically disabled and marked “Not Available”.

4. **Multi-Method Secure Authentication with BetterAuth & MongoDB:**
   Full-featured authentication powered by BetterAuth with MongoDB adapter and JWT validation. Supports credential registration with strict password criteria (min 6 characters, uppercase, and lowercase requirements) and Google social sign-in.

5. **Aesthetic Color Hunt Palette & Dual Theme System:**
   Bespoke bookish aesthetic utilizing the Color Hunt `#FEFAF3`, `#F6E2E9`, `#B8CFB3`, `#84A282` palette. Features an instant Dark/Light theme toggle in the navbar with persistent local storage.

6. **Interactive Search, Category Filters, & Swiper Hero Banner:**
   Features an autoplaying Swiper.js hero banner, real-time client-side searching by title or author, category filter pills (Fiction, Science, History, Kids, Others), and sorting options.

7. **Zero Lorem Ipsum & Custom Modals/Toasts:**
   100% meaningful copy with zero placeholder text. Success and error states are elegantly handled through `react-hot-toast` and custom interactive dialog modals (no native browser alert/confirm dialogues).

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Styling:** Tailwind CSS v4, DaisyUI v5 (Custom Color Hunt palette)
- **Typography:** Playfair Display (Serif headings) & Plus Jakarta Sans (Body)
- **Authentication:** BetterAuth + MongoDB Adapter + JWT Plugin
- **Database:** MongoDB
- **Animations & Sliders:** Swiper.js, Framer Motion
- **Feedback & Notifications:** React Hot Toast
- **Image Upload:** ImgBB API with direct image URL fallback

---

## 🧭 Page Routes & Architecture

| Route | Type | Description |
|---|---|---|
| `/` | Public | Home page with Swiper banner, latest 6 arrivals, How Borrowing Works, and Top Categories |
| `/books` | Public | Grid of all books (3 per row on desktop) with search, filter, and sorting |
| `/books/:id` | Private/Public | Comprehensive book details with loan specs and 7-day borrow modal |
| `/add-book` | Private | Form to contribute books with title, author, category, copies, and image upload |
| `/my-books` | Private | Contributor dashboard to edit titles and delete with custom confirm modal |
| `/my-borrows` | Private | Table of user's active borrowed books with 7-day return dates and return action |
| `/login` | Public | Sign-in page with credential and Google OAuth support |
| `/register` | Public | Registration page with interactive password validation checklist |
| `/profile` | Private | Reader profile overview with verified reader badge and shortcuts |
| `/*` (404) | Public | Custom bookish 404 page with navigation back to Home |

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/imakashdey/Booknook-Client.git
cd Booknook-Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:
```env
BETTER_AUTH_SECRET=your_32_character_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=booknook
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ License
Designed & built with care for **BookNook – A Small Online Library**. All rights reserved.