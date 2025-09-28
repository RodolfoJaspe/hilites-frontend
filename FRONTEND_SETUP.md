# Frontend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd hilites
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `hilites` directory:

```env
# Backend API URL (default: http://localhost:3000/api)
REACT_APP_API_URL=http://localhost:3000/api

# For production, update this to your deployed backend URL:
# REACT_APP_API_URL=https://your-backend-domain.com/api
```

### 3. Start Development Server

```bash
npm start
```

## 📱 Features Implemented

### ✅ Highlights Tab

- **Real-time highlights** from Scorebat API
- **Search functionality** by team name
- **Competition filtering** (Premier League, La Liga, etc.)
- **Responsive grid layout** with thumbnails
- **Loading states** and error handling
- **Cache management** (15-minute cache)

### ✅ Teams Tab

- **Complete teams database** with comprehensive info
- **Search teams** by name, league, country
- **Filter by country** (England, Spain, Germany, etc.)
- **Filter by league** (Premier League, La Liga, etc.)
- **Team details** including stadium info, founded year
- **Responsive card layout**

### 🔧 Technical Features

- **Custom React hooks** for data management
- **API service layer** for backend communication
- **Error handling** with user-friendly messages
- **Loading states** with spinners
- **Responsive design** for mobile and desktop
- **Tab-based navigation** between highlights and teams

## 🎯 API Integration

The frontend connects to these backend endpoints:

### Highlights API

- `GET /api/highlights` - Get all highlights
- `GET /api/highlights/search?q=team` - Search highlights
- `GET /api/highlights/competition/:competition` - Filter by competition
- `GET /api/highlights/refresh` - Force refresh cache

### Teams API

- `GET /api/teams` - Get all teams
- `GET /api/teams/country/:country` - Filter by country
- `GET /api/teams/league/:league` - Filter by league
- `GET /api/teams/meta/countries` - Get available countries
- `GET /api/teams/meta/leagues` - Get available leagues

## 🎨 Components Structure

```
src/
├── components/
│   ├── HighlightsList.js     # Highlights display component
│   ├── HighlightsList.css    # Highlights styling
│   ├── TeamsList.js          # Teams display component
│   ├── TeamsList.css         # Teams styling
│   └── Home.js               # Main home component
├── hooks/
│   ├── useHighlights.js      # Highlights data management
│   └── useTeams.js           # Teams data management
├── services/
│   └── api.js                # Backend API service
└── styles/
    └── Home.css              # Home component styling
```

## 🔄 Data Flow

1. **Components** use custom hooks (`useHighlights`, `useTeams`)
2. **Hooks** call the API service (`api.js`)
3. **API service** makes HTTP requests to backend
4. **Backend** fetches data from Scorebat API and teams database
5. **Data flows back** through the chain to update UI

## 🎯 Next Steps

### Authentication Integration

- Add login/signup forms
- Implement user preferences (favorite teams/players)
- Add protected routes

### Enhanced Features

- Video player integration for highlights
- User profiles and social features
- Push notifications for favorite teams
- Advanced search and filtering

### Performance Optimization

- Implement pagination for large datasets
- Add infinite scrolling
- Optimize image loading
- Add service worker for offline support

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**

   - Check if backend server is running on port 3000
   - Verify `REACT_APP_API_URL` in `.env` file
   - Check browser console for CORS errors

2. **No Data Loading**

   - Ensure backend is seeded with teams data
   - Check Scorebat API connectivity
   - Verify backend endpoints are working

3. **Styling Issues**
   - Clear browser cache
   - Check if CSS files are properly imported
   - Verify responsive breakpoints

### Development Tips

- Use browser dev tools to inspect API calls
- Check Network tab for failed requests
- Use React DevTools for component debugging
- Monitor console for error messages

## 📱 Mobile Responsiveness

The app is fully responsive with:

- Mobile-first design approach
- Touch-friendly interface
- Optimized layouts for small screens
- Collapsible navigation on mobile
- Swipe-friendly card layouts
