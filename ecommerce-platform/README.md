# E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js, featuring a beautiful UI, animations, and complete shopping functionality.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Framer Motion animations
- **Product Management**: Dynamic product listings with categories
- **Shopping Cart**: Full cart functionality with Stripe integration
- **User Authentication**: Secure authentication with NextAuth.js
- **Database Integration**: Prisma ORM with PostgreSQL/MySQL support
- **Payment Processing**: Stripe payment gateway integration
- **Admin Dashboard**: Product and order management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.1
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **UI Components**: Headless UI, Heroicons

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Database (PostgreSQL/MySQL)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file and fill in your values
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Your app URL
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Deployment on Vercel

This project is optimized for Vercel deployment:

### Quick Deploy
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Manual Deploy
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production
Set these in your Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your Vercel app URL)
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── shop/         # Shop pages
│   ├── cart/         # Cart functionality
│   └── page.tsx      # Home page
├── components/       # Reusable components
└── lib/             # Utilities and configurations

prisma/
├── schema.prisma    # Database schema
├── migrations/      # Database migrations
└── seed.ts         # Database seeding
```

## 🎯 Key Features Details

### Product Catalog
- Dynamic product filtering by category
- Search functionality
- Product detail pages with image galleries

### Shopping Experience
- Add to cart functionality
- Cart management (add, remove, update quantities)
- Checkout process with Stripe integration

### User Management
- User registration and login
- Order history
- Profile management

### Admin Features
- Product management (CRUD operations)
- Order management
- User management

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run migrations
- `npx prisma db seed` - Seed database

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for custom themes
- Update color schemes in CSS variables
- Customize animations in Framer Motion components

### Adding New Features
1. Create new API routes in `src/app/api/`
2. Add new pages in `src/app/`
3. Create reusable components in `src/components/`
4. Update database schema in `prisma/schema.prisma`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the Next.js documentation
- Review Vercel deployment guides
