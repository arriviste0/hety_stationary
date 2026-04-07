# HETY Stationery

Storefront plus admin panel for HAPY FRANCHISE LLP / HETY STATIONERY.

## Run Locally

```bash
npm install
npm run dev
```

Create `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/hety_stationery_admin
JWT_SECRET=replace-this-with-a-secure-secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASS=replace-this-password
SMTP_FROM=notifications@example.com
SMTP_SECURE=false
ADMIN_NOTIFICATION_EMAIL=pranshu.arvind.patel@gmail.com
APP_URL=http://localhost:3000
PHONEPE_ENV=sandbox
PHONEPE_CLIENT_ID=your-phonepe-client-id
PHONEPE_CLIENT_SECRET=your-phonepe-client-secret
PHONEPE_CLIENT_VERSION=1
```

PhonePe notes:

- `PHONEPE_ENV=sandbox` uses PhonePe UAT endpoints
- `PHONEPE_ENV=production` uses live endpoints
- `APP_URL` must point to the public base URL used for the PhonePe redirect after payment
- The checkout flow now supports `COD` and `PhonePe`

## Seed Demo Admin Data

Start the app, then seed:

```bash
curl -X POST http://localhost:3000/api/admin/seed
```

## Admin Access

- URL: `http://localhost:3000/admin`
- Login page: `http://localhost:3000/admin/login`
- Demo user: `admin@hetystationery.com`
- Demo password: `admin123`

Role coverage:

- `super_admin`
- `product_manager`
- `order_manager`
- `inventory_manager`

## Admin Modules

- Dashboard
- Categories
- Products
- Inventory
- Orders
- Customers
- Vendors
- Purchases
- Promotions / Coupons
- Reports
- Settings

## API Endpoints

- `GET/POST /api/admin/dashboard`
- `GET/POST /api/admin/categories`
- `GET/POST /api/admin/products`
- `GET/POST /api/admin/orders`
- `GET/POST /api/admin/vendors`
- `GET/PUT/DELETE /api/admin/vendors/:id`
- `GET/POST /api/admin/purchases`
- `GET/PUT/DELETE /api/admin/purchases/:id`
- `GET/POST /api/admin/coupons`
- `GET/PUT/DELETE /api/admin/coupons/:id`
- `POST /api/admin/upload`
- `POST /api/admin/seed`

## Folder Structure

```text
app/
  admin/
    (auth)/
    (panel)/
  api/admin/
components/
  admin/
data/
lib/
  actions/
  models/
  jwt.ts
  auth.ts
```

## Notes

- Admin authentication now uses JWT in an HTTP-only cookie.
- Uploaded files are stored locally in `public/uploads`.
- The admin pages use MongoDB-backed models and demo seed data.
