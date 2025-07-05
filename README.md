# Getting Started

## 1. Clone the repository
```bash
git clone https://github.com/OlegPoloviy/quizCreator
cd quizCreator
```

## 2. Install dependencies

### Backend
```bash
cd backend/quiz-creator
npm install
# or
yarn install
```

### Frontend
```bash
cd frontend/quiz-creator
npm install
# or
yarn install
```

## 3. Set up environment variables

### Backend
1. Copy `.env.example` to `.env` in `backend/quiz-creator`
2. Set your `DATABASE_URL` and (optionally) `DIRECT_URL` for Prisma

```bash
cp .env.example .env
```

### Frontend
1. Copy `.env.example` to `.env` in `frontend`
2. Set your API endpoint if needed

```bash
cp .env.example .env
```

## 4. Database setup
```bash
cd backend/quiz-creator
npx prisma migrate dev
# or
npx prisma db push
```

## 5. Run the applications

### Backend
```bash
cd backend/quiz-creator
npm start:dev
# or
yarn start:dev
```

### Frontend
```bash
cd frontend
npm run dev
# or
yarn dev
```
