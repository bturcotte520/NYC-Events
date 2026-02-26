# NYC Free Events

A dark-themed, modern calendar application showing free public events happening in NYC. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

![NYC Free Events](https://img.shields.io/badge/NYC-Free%20Events-6366f1)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **Monthly Calendar View**: Interactive calendar with dots indicating days with events
- **Event Cards**: Color-coded badges by event type with detailed information
- **Borough Filter**: Filter events by NYC borough
- **Event Type Filter**: Filter by event categories
- **This Weekend Button**: Quick filter to see weekend events
- **Mobile Responsive**: Fully responsive design for all devices
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Graceful error states with retry functionality

## Data Source

Events are pulled from the [NYC Open Data Socrata API](https://data.cityofnewyork.us/resource/tvpp-9vvx.json).

### Filtered Event Types

The following event types are automatically excluded:
- Sport - Youth
- Sport - Adult
- Theater Load in and Load Outs

Also excluded: Events with names containing "Lawn Closure" or "Picnic House"

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The static export will be generated in the `dist` folder.

## Deployment

The app is configured for static export. You can deploy the `dist` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider

## Technologies Used

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **API**: NYC Open Data Socrata API

## Project Structure

```
my-app/
├── app/
│   ├── globals.css       # Global styles and dark theme
│   ├── layout.tsx        # Root layout with dark mode
│   └── page.tsx          # Main page component
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── calendar.tsx      # Monthly calendar component
│   ├── event-list.tsx    # Event cards list
│   └── filters.tsx       # Filter controls
├── lib/
│   ├── api.ts            # NYC Open Data API client
│   ├── types.ts          # TypeScript types and constants
│   └── utils.ts          # Utility functions
├── dist/                 # Production build output
└── next.config.ts        # Next.js configuration
```

## API Response Fields

The app uses the following fields from the NYC Open Data API:
- `event_id` - Unique event identifier
- `event_name` - Event title
- `start_date_time` - Event start time (ISO format)
- `end_date_time` - Event end time (ISO format)
- `event_type` - Category/type of event
- `event_borough` - NYC borough where event takes place
- `event_location` - Specific venue or location

## License

MIT
