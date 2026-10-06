# 🌤️ WeatherNow — Modern Weather App

A modern, responsive weather application built with **React.js** and **OpenWeather API**. WeatherNow provides real-time weather information, forecasts, air quality data, favorite cities, location-based weather, and an interactive weather dashboard.

## 🚀 Live Demo

**Live:** https://ziyanreactweatherapp.netlify.app/

## ✨ Features

- 🌍 Search weather by city
- 🔎 Smart city search autocomplete
- 📍 Detect weather using current location
- 🌡️ Current temperature and feels-like temperature
- 📅 5-day weather forecast
- 🕐 Hourly weather forecast
- 🌧️ Rain probability
- 🌅 Sunrise and sunset information
- 💨 Wind, humidity, pressure and visibility
- 🌫️ Air Quality Index (AQI)
- ❤️ Favorite cities
- 🕘 Recently searched cities
- 📊 Interactive temperature chart
- 🌦️ Dynamic weather-based UI
- 🌙 Dark mode
- 🔄 Refresh weather data
- ⚠️ User-friendly error handling
- 📱 Fully responsive design
- ♿ Reduced-motion accessibility support

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite

### Libraries
- Lucide React
- Recharts

### API
- OpenWeather API

### Deployment
- Netlify
- Netlify Functions

## 🏗️ Architecture

The application uses a server-side Netlify Function as a secure proxy for OpenWeather API requests.

```text
React Frontend
      ↓
Netlify Function
      ↓
OpenWeather API
      ↓
Weather Data
      ↓
React Dashboard
```

The OpenWeather API key is stored as a server-side environment variable instead of exposing it directly in the frontend.

## 📱 Responsive Design

WeatherNow is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile
- Small-screen devices

The interface includes responsive layouts, horizontal forecast scrolling, touch-friendly controls and reduced-motion support.

## 📂 Main Features

### City Search
Users can search for cities with autocomplete suggestions containing city, state and country information.

### Favorites
Frequently used cities can be saved as favorites and accessed quickly without searching again.

### Current Location
The application can use browser geolocation to find weather conditions for the user's current location.

### Forecast Dashboard
WeatherNow displays current conditions along with hourly and 5-day forecasts.

### Air Quality
Users can view AQI information and pollutant details for the selected location.

### Weather Visualization
Temperature trends are displayed using an interactive Recharts graph.

## 🔐 Environment Variables

For local development, configure the OpenWeather API key in your environment.

Example:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

Do not commit API keys or other secrets to GitHub.

## ⚙️ Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd Weather-App-with-React-OpenWeather-API
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown by Vite.

## 📸 Screenshots

Add screenshots of:

1. Main weather dashboard
2. City autocomplete
3. Hourly forecast
4. 5-day forecast
5. Air quality section
6. Mobile responsive view

## 🎯 What I Learned

While building WeatherNow, I worked with:

- React state and lifecycle management
- API integration
- Asynchronous JavaScript
- Debounced search
- Browser Geolocation API
- LocalStorage
- Responsive CSS
- Data visualization with Recharts
- Environment variables
- Serverless functions
- Netlify deployment
- Production error handling

## 🔮 Future Improvements

- Weather notifications
- Multiple weather providers
- PWA/offline support
- Weather maps
- More detailed historical weather
- Internationalization
- Improved accessibility

## 👨‍💻 Author

**Ziyan Khan**

B.Tech Computer Science & Engineering Student

Interested in Full Stack Development, React and modern web applications.
