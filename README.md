# UltraMind Companion

A comprehensive brain health optimization app built with React Native + Expo, Node.js, Prisma, and PostgreSQL.

## 🧠 Overview

UltraMind Companion is a mobile application designed to help users optimize their brain health through:
- Personalized 6-week wellness programs
- AI-powered coaching and insights
- Daily check-ins and mood tracking
- Supplement planning and tracking
- Mindfulness exercises and breathing techniques
- Nutrition protocols
- Progress analytics and reporting

## 📁 Project Structure

```
ultramind-companion/
├── app/                          # React Native + Expo Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── screens/              # App screens
│   │   ├── navigation/           # React Navigation setup
│   │   ├── store/                # Zustand state management
│   │   ├── services/             # API services
│   │   ├── hooks/                # Custom hooks
│   │   ├── utils/                # Utility functions
│   │   ├── types/                # TypeScript types
│   │   └── constants/            # App constants
│   ├── assets/                   # Images, fonts, etc.
│   ├── app.json                  # Expo config
│   └── package.json
│
├── backend/                      # Node.js + Prisma Backend
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── controllers/          # Route controllers
│   │   ├── services/             # Business logic
│   │   ├── middleware/           # Express middleware
│   │   └── utils/                # Utilities
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Expo CLI
- iOS Simulator / Android Emulator

### Frontend Setup
```bash
cd app
npm install
npx expo start
```

### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## 📱 Features

### Onboarding Flow
- Welcome screen with app introduction
- Goal selection (Mental Clarity, Emotional Resilience, Physical Energy, System Reset)
- Challenge identification (Brain Fog, Low Energy, Mood Swings, etc.)
- Baseline assessment quiz
- Personalized path generation

### Core Features
- **Dashboard**: Daily routine progress, 6-week program tracker, quick actions
- **AI Coach**: Personalized AI-powered health coaching with insights
- **Morning Check-In**: Daily mood, energy, and brain clarity tracking
- **Supplement Planner**: Track supplements with timing schedules
- **Mind Training**: Guided breathing exercises with binaural beats
- **Nutrition Protocol**: Weekly nutrition scores and food recommendations
- **Progress Analytics**: Radar charts, trend lines, and export options
- **Worksheets Hub**: Brain chemistry scorecard, food journal, trigger logs
- **Emotional Detox**: Journaling with cognitive reframing tools

### Subscription Tiers
- Monthly: $19.99/mo
- Yearly: $119.99/yr (40% off)
- Quarterly: $49.99/3-mo

## 🛠 Tech Stack

### Frontend
- React Native + Expo SDK 52
- TypeScript
- React Navigation 6
- Zustand (State Management)
- React Query (Server State)
- RevenueCat (Subscriptions)
- Expo Notifications

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- OpenAI API (AI Coach)
- JWT Authentication

## 📦 App Store Preparation

See `/app/APPSTORE_CHECKLIST.md` for complete submission requirements.

## 📄 License

Proprietary - All rights reserved.
