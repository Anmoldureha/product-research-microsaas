# ResearchPal Pro

> **Deep-dive any product in 30 seconds** - Production-ready Micro-SaaS for instant product intelligence reports.

A comprehensive product research platform built with Next.js 14, featuring AI-powered analysis, payment integration (PhonePe & Stripe), and 8-section intelligence reports.

## 🚀 Features

- **AI-Powered Research**: GPT-4o-mini generates comprehensive 8-section product reports
- **Pay-as-you-go**: ₹5/search with PhonePe (UPI & Wallet) and Stripe integration
- **Real-time Processing**: BullMQ + Redis for background research jobs
- **Authentication**: Lucia Auth with secure session management
- **Modern Stack**: Next.js 14 App Router, React Server Components, tRPC, Prisma
- **Production Ready**: Docker, TypeScript, comprehensive error handling

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React Server Components, Tailwind CSS, shadcn/ui
- **Backend**: tRPC, Prisma ORM, Neon Postgres
- **Authentication**: Lucia Auth with argon2 password hashing
- **Payments**: PhonePe PG SDK, Stripe
- **AI**: Vercel AI SDK with OpenAI GPT-4o-mini
- **Queue**: BullMQ + Redis for background jobs
- **Email**: Resend (planned)
- **Deployment**: Vercel, Docker

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL database (or use Docker)
- Redis instance (or use Docker)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd researchpal-pro
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/researchpal"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-your-openai-key"

# PhonePe (for Indian payments)
PHONEPE_MERCHANT_ID="your-phonepe-merchant-id"
PHONEPE_SALT_KEY="your-phonepe-salt-key"
PHONEPE_SALT_INDEX="1"
PHONEPE_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox"

# Stripe (for international payments)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# Email (optional)
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="noreply@researchpal.pro"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
```

### 3. Start Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Generate Prisma client and run migrations
npm run db:generate
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

### 4. Development

```bash
# Start the Next.js dev server
npm run dev

# In another terminal, start the worker for processing research jobs
npm run worker
```

Visit `http://localhost:3000` to see the app!

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (marketing)/       # Landing, pricing, testimonials
│   ├── (auth)/            # Login, register
│   ├── (app)/             # Dashboard, search, topup
│   └── api/               # API routes (tRPC, webhooks)
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── trpc/              # tRPC setup and routers
│   ├── auth.ts            # Lucia authentication
│   ├── db.ts              # Prisma client
│   ├── phonepe.ts         # PhonePe integration
│   ├── stripe.ts          # Stripe integration
│   ├── queue.ts           # BullMQ setup
│   └── worker.ts          # Background job processor
prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Sample data
```

## 🔄 Background Jobs

The AI research pipeline uses BullMQ for processing:

1. User submits product name
2. Job queued in Redis
3. Worker processes:
   - Validates product
   - Generates AI analysis using GPT-4o-mini
   - Saves 8-section report to database
   - Sends email notification (planned)

Start the worker:
```bash
npm run worker
```

## 💳 Payment Integration

### PhonePe (Indian Market)
- UPI and Wallet payments
- Webhook verification with checksum
- Automatic credit top-up

### Stripe (International)
- Card payments worldwide
- Webhook events for payment confirmation
- Secure checkout sessions

## 🎯 8-Section Intelligence Report

Each product analysis includes:

1. **Executive Summary**: 2-3 line overview
2. **Product Overview**: Features, specs, price range
3. **Market Position**: Brand reputation, market share
4. **Customer Sentiment**: User satisfaction, common feedback
5. **Competitive Analysis**: Top 3 competitors comparison
6. **Technical Specs**: Detailed specifications
7. **Pricing Analysis**: Price trends, value proposition
8. **Recommendation**: Final verdict with pros/cons

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Import to Vercel
3. Add environment variables
4. Deploy!

Required environment variables for production:
- Database URL (Neon, PlanetScale, etc.)
- Redis URL (Upstash, etc.)
- OpenAI API key
- Payment provider credentials
- Authentication secrets

### Docker

```bash
docker build -t researchpal-pro .
docker run -p 3000:3000 researchpal-pro
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with UI
npm run test:ui

# E2E tests
npm run playwright
```

## 📊 Database

### Migrations

```bash
# Create migration
npm run db:migrate

# Reset database
npx prisma migrate reset

# View data
npm run db:studio
```

### Schema Overview

- **Users**: Authentication, credits
- **Orders**: Payment transactions
- **Reports**: Generated research data
- **Sessions**: Lucia auth sessions

## 🔐 Security

- Lucia Auth with secure session management
- Argon2 password hashing
- CSRF protection
- Rate limiting (planned)
- Environment variable validation
- Webhook signature verification

## 📈 Monitoring

- Built-in error handling
- Console logging for development
- Production-ready error boundaries
- Payment webhook logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Email**: support@researchpal.pro
- **Documentation**: Check this README
- **Issues**: GitHub Issues

---

Built with ❤️ using Next.js 14, tRPC, and modern web technologies.