# E6:12 Intel PIMAS

A geopolitical intelligence & real-time event tracking application built with React, PrimeReact, and Skote theme.

## Technologies Used

- Frontend: React with Skote Theme
- UI Components: PrimeReact & PrimeFlex
- State Management: Redux
- Backend: Supabase
- Data Sources: NewsAPI, Guardian API, GNews, Twitter/X, Telegram
- AI Features: Sentiment Analysis, Bias Detection, Trend Forecasting

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example` and fill in your API keys.

3. Start the development server:
```bash
npm run dev
```

## Project Structure

- `/src/components/` - Reusable UI components (PascalCase)
- `/src/hooks/` - Custom React hooks (useCamelCase)
- `/src/services/` - API services and data fetching
- `/src/pages/` - Page-level components
- `/src/constants.ts` - Global constants and configuration

## UI Components

The project uses PrimeReact components for consistent styling and functionality. Key features include:

- Responsive design using PrimeFlex grid system
- Modern UI components from PrimeReact
- Skote theme integration for consistent styling
- Mobile-first approach

## Development Guidelines

1. Use PrimeReact components over custom components
2. Follow ES6+ syntax (arrow functions, async/await)
3. Implement proper error handling for API calls
4. Keep components modular and reusable
5. Follow the DRY principle
6. Use functional components over class components

## License

Private - All rights reserved