import { useEffect, useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Search,
  MapPin,
  LoaderCircle,
  Sunrise,
  Sunset,
  Moon,
  RefreshCw,
  Navigation,
  Heart,
  Trash2,
  CloudFog,
  Thermometer,
  CalendarDays,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Card, CardContent } from "./components/Card";
import Input from "./components/Input";
import Button from "./components/Button";

const API_KEY = '6bd7e14381850dde176fdd5c7fed1c5a';

const getWeatherIcon = (condition, size = 70) => {
  switch (condition) {
    case "Clear":
      return <Sun size={size} />;

    case "Clouds":
      return <Cloud size={size} />;

    case "Rain":
    case "Drizzle":
      return <CloudRain size={size} />;

    case "Snow":
      return <CloudSnow size={size} />;

    case "Thunderstorm":
      return <CloudLightning size={size} />;

    default:
      return <Cloud size={size} />;
  }
};

const formatTime = (timestamp, timezone) => {
  const date = new Date((timestamp + timezone) * 1000);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

const getTemperature = (celsius, unit) => {
  if (unit === "F") {
    return Math.round((celsius * 9) / 5 + 32);
  }

  return Math.round(celsius);
};

const getForecastIcon = (condition, size = 34) => {
  switch (condition) {
    case "Clear":
      return <Sun size={size} />;

    case "Clouds":
      return <Cloud size={size} />;

    case "Rain":
    case "Drizzle":
      return <CloudRain size={size} />;

    case "Snow":
      return <CloudSnow size={size} />;

    case "Thunderstorm":
      return <CloudLightning size={size} />;

    case "Mist":
    case "Fog":
    case "Haze":
      return <CloudFog size={size} />;

    default:
      return <Cloud size={size} />;
  }
};

const getWeatherTheme = (condition) => {
  switch (condition) {
    case "Clear":
      return "weather-clear";

    case "Rain":
    case "Drizzle":
      return "weather-rain";

    case "Thunderstorm":
      return "weather-storm";

    case "Snow":
      return "weather-snow";

    case "Clouds":
      return "weather-clouds";

    default:
      return "weather-default";
  }
};

const getDayName = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
    }
  );
};

const getAQIInfo = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        label: "Good",
        description: "Air quality is considered satisfactory.",
        className: "aqi-good",
      };

    case 2:
      return {
        label: "Fair",
        description: "Air quality is acceptable for most people.",
        className: "aqi-fair",
      };

    case 3:
      return {
        label: "Moderate",
        description: "Sensitive people may experience discomfort.",
        className: "aqi-moderate",
      };

    case 4:
      return {
        label: "Poor",
        description: "Health effects may be noticed by sensitive groups.",
        className: "aqi-poor",
      };

    case 5:
      return {
        label: "Very Poor",
        description: "Health warnings may be needed.",
        className: "aqi-very-poor",
      };

    default:
      return {
        label: "Unknown",
        description: "Air quality data is unavailable.",
        className: "aqi-unknown",
      };
  }
};

const getHour = (dateText) => {
  return new Date(dateText).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
    }
  );
};


export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favoriteCities")) || [];
    } catch {
      return [];
    }
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [error, setError] = useState("");

  const [unit, setUnit] = useState(
    localStorage.getItem("temperatureUnit") || "C"
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [recentCities, setRecentCities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentCities")) || [];
    } catch {
      return [];
    }
  });

  const [airQuality, setAirQuality] = useState(null);


  // --------------------------------
// WEATHER ALERT
// --------------------------------

const getWeatherAlert = () => {
  if (!weather) return null;

  const condition = weather.weather?.[0]?.main;
  const description = weather.weather?.[0]?.description;
  const temp = weather.main?.temp;
  const windSpeed = weather.wind?.speed;

  if (condition === "Thunderstorm") {
    return {
      type: "storm",
      icon: <CloudLightning size={22} />,
      title: "Thunderstorm Alert",
      message: `Thunderstorm conditions detected. Stay indoors and avoid unnecessary travel.`,
    };
  }

  if (
    condition === "Rain" &&
    description?.toLowerCase().includes("heavy")
  ) {
    return {
      type: "rain",
      icon: <CloudRain size={22} />,
      title: "Heavy Rain Alert",
      message: `Heavy rainfall is currently expected. Carry an umbrella and travel carefully.`,
    };
  }

  if (temp >= 40) {
    return {
      type: "hot",
      icon: <Thermometer size={22} />,
      title: "Extreme Heat Alert",
      message: `Temperature is ${Math.round(
        temp
      )}°C. Stay hydrated and avoid prolonged exposure to the sun.`,
    };
  }

  if (temp <= 5) {
    return {
      type: "cold",
      icon: <CloudSnow size={22} />,
      title: "Low Temperature Alert",
      message: `Temperature is ${Math.round(
        temp
      )}°C. Dress warmly and take care in cold conditions.`,
    };
  }

  if (windSpeed >= 15) {
    return {
      type: "wind",
      icon: <Wind size={22} />,
      title: "Strong Wind Alert",
      message: `Strong winds are currently being reported. Take extra care outdoors.`,
    };
  }

  if (condition === "Snow") {
    return {
      type: "snow",
      icon: <CloudSnow size={22} />,
      title: "Snow Alert",
      message: `Snow conditions are currently being reported. Travel carefully.`,
    };
  }

  return null;
};

const weatherAlert = getWeatherAlert();

    // --------------------------------
  // CITY AUTOCOMPLETE
  // --------------------------------

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // --------------------------------
  // DARK MODE
  // --------------------------------

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // --------------------------------
  // TEMPERATURE UNIT
  // --------------------------------

  useEffect(() => {
    localStorage.setItem("temperatureUnit", unit);
  }, [unit]);


  // --------------------------------
  // CITY AUTOCOMPLETE
  // --------------------------------

  useEffect(() => {
    const trimmedCity = city.trim();

    // Less than 2 characters = no suggestions
    if (trimmedCity.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSuggestionsLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setSuggestionsLoading(true);

        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            trimmedCity
          )}&limit=5&appid=${API_KEY}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load city suggestions.");
        }

        const data = await response.json();

        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        // Ignore aborted requests
        if (err.name !== "AbortError") {
          console.error("Autocomplete error:", err);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSuggestionsLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [city]);

  // --------------------------------
  // SELECT CITY SUGGESTION
  // --------------------------------

  const selectSuggestion = (suggestion) => {
    const selectedCity = suggestion.name;

    setCity(selectedCity);
    setSuggestions([]);
    setShowSuggestions(false);

    fetchWeather(selectedCity);
  };

  // --------------------------------
  // FETCH WEATHER
  // --------------------------------

  const fetchWeather = async (searchCity = city) => {
  const trimmedCity = searchCity.trim();

  if (!trimmedCity) {
    setError("Please enter a city name.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        trimmedCity
      )}&appid=${API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        throw new Error(
          "City not found. Please check the city name."
        );
      }

      if (weatherResponse.status === 401) {
        throw new Error(
          "Invalid API key. Check your OpenWeather API key."
        );
      }

      throw new Error(
        "Unable to fetch weather data."
      );
    }

    const weatherData =
      await weatherResponse.json();

    setWeather(weatherData);
    setCity(weatherData.name);
    setLastUpdated(new Date());

    // -----------------------------
    // FETCH 5-DAY FORECAST
    // -----------------------------

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error(
        "Weather found, but forecast could not be loaded."
      );
    }

    const forecastData =
      await forecastResponse.json();

    setForecast(forecastData);

    // -----------------------------
// FETCH AIR QUALITY
// -----------------------------

const airQualityResponse = await fetch(
  `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`
);

if (airQualityResponse.ok) {
  const airQualityData = await airQualityResponse.json();
  setAirQuality(airQualityData);
} else {
  setAirQuality(null);
}

    // -----------------------------
    // RECENT SEARCH
    // -----------------------------

    setRecentCities((previous) => {
      const updated = [
        weatherData.name,
        ...previous.filter(
          (item) =>
            item.toLowerCase() !==
            weatherData.name.toLowerCase()
        ),
      ].slice(0, 5);

      localStorage.setItem(
        "recentCities",
        JSON.stringify(updated)
      );

      return updated;
    });

} catch (err) {
  console.error("Weather error:", err);

  setWeather(null);
  setForecast(null);
  setAirQuality(null);

  if (!navigator.onLine) {
    setError(
      "You are offline. Please check your internet connection."
    );
  } else if (err.name === "TypeError") {
    setError(
      "Unable to connect to the weather service. Please try again."
    );
  } else {
    setError(
      err.message || "Something went wrong. Please try again."
    );
  }
}
  
  finally {
    setLoading(false);
  }
};

  // --------------------------------
  // SEARCH
  // --------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  // --------------------------------
  // CURRENT LOCATION
  // --------------------------------

  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser.");
    return;
  }

  setLocationLoading(true);
  setError("");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Unable to get weather for your location.");
        }

        const data = await response.json();

        setWeather(data);
        setCity(data.name);
        setLastUpdated(new Date());

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
          throw new Error(
            "Current weather loaded, but forecast failed."
          );
        }

        const forecastData = await forecastResponse.json();

        setForecast(forecastData);

        // -----------------------------
        // FETCH AIR QUALITY
        // -----------------------------

        const airQualityResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );

        if (airQualityResponse.ok) {
          const airQualityData = await airQualityResponse.json();
          setAirQuality(airQualityData);
        } else {
          setAirQuality(null);
        }

        setRecentCities((previous) => {
          const updated = [
            data.name,
            ...previous.filter(
              (item) =>
                item.toLowerCase() !== data.name.toLowerCase()
            ),
          ].slice(0, 5);

          localStorage.setItem(
            "recentCities",
            JSON.stringify(updated)
          );

          return updated;
        });

      } catch (err) {
        setError(
          err.message ||
          "Unable to load weather for your location."
        );
      } finally {
        setLocationLoading(false);
      }
    },

    (error) => {
      setLocationLoading(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError(
            "Location permission was denied. Please allow location access and try again."
          );
          break;

        case error.POSITION_UNAVAILABLE:
          setError(
            "Your location could not be detected. Please check your device location settings."
          );
          break;

        case error.TIMEOUT:
          setError(
            "Location request timed out. Please try again."
          );
          break;

        default:
          setError(
            "Unable to determine your location. Please try again."
          );
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    }
  );
};

  // --------------------------------
  // DELETE RECENT CITY
  // --------------------------------

  const removeRecentCity = (cityToRemove) => {
    const updated = recentCities.filter(
      (item) => item !== cityToRemove
    );

    setRecentCities(updated);

    localStorage.setItem(
      "recentCities",
      JSON.stringify(updated)
    );
  };

  // --------------------------------
  // REFRESH
  // --------------------------------

  const refreshWeather = () => {
    if (weather?.name) {
      fetchWeather(weather.name);
    }
  };

  // --------------------------------
  // FORECAST DATA
  // --------------------------------

  const hourlyForecast = forecast
    ? forecast.list.slice(0, 8)
    : [];

  const temperatureData = hourlyForecast.map((item) => ({
    time: getHour(item.dt_txt),
    temperature: getTemperature(item.main.temp, unit),
  }));

  const dailyForecast = forecast
    ? Object.values(
        forecast.list.reduce((days, item) => {
          const date = item.dt_txt.split(" ")[0];
          if (!days[date]) days[date] = [];
          days[date].push(item);
          return days;
        }, {})
      )
        .slice(0, 5)
        .map((day) => {
          const temps = day.map((item) => item.main.temp);
          const representative =
            day.find((item) => item.dt_txt.includes("12:00:00")) ||
            day[Math.floor(day.length / 2)];

          return {
            date: representative.dt,
            min: Math.min(...temps),
            max: Math.max(...temps),
            condition: representative.weather[0].main,
            description: representative.weather[0].description,
          };
        })
    : [];

  // --------------------------------
  // FAVORITES
  // --------------------------------

  const toggleFavorite = () => {
    if (!weather?.name) return;

    setFavorites((previous) => {
      const exists = previous.some(
        (item) => item.toLowerCase() === weather.name.toLowerCase()
      );

      const updated = exists
        ? previous.filter(
            (item) => item.toLowerCase() !== weather.name.toLowerCase()
          )
        : [...previous, weather.name].slice(0, 10);

      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = weather?.name
    ? favorites.some(
        (item) => item.toLowerCase() === weather.name.toLowerCase()
      )
    : false;

  return (
    <main
      className={`weather-page ${
        weather
          ? getWeatherTheme(weather.weather[0].main)
          : "weather-default"
      }`}
    >
      <div className="weather-container">

        {/* HEADER */}

        <header className="app-header">

          <div className="logo">
            <Sun size={30} />
          </div>

          <div className="header-title">
            <h1>WeatherNow</h1>
            <p>Live weather information</p>
          </div>

          <div className="header-actions">

            <button
              className="icon-button"
              onClick={() => setDarkMode((previous) => !previous)}
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

          </div>

        </header>

        {/* SEARCH CARD */}

        <Card>
          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="search-form"
            >

              <div className="autocomplete-wrapper">

  <div className="input-wrapper">

    <Search size={20} />

    <Input
      value={city}
      onChange={(e) => {
        setCity(e.target.value);
        setShowSuggestions(true);
      }}
      onFocus={() => {
        if (suggestions.length > 0) {
          setShowSuggestions(true);
        }
      }}
      placeholder="Search city..."
      aria-label="City name"
      autoComplete="off"
    />

    {suggestionsLoading && (
      <LoaderCircle
        size={17}
        className="autocomplete-spinner"
      />
    )}

  </div>

  {/* CITY SUGGESTIONS */}

  {showSuggestions && suggestions.length > 0 && (
    <div className="city-suggestions">

      {suggestions.map((suggestion, index) => (
        <button
          type="button"
          className="city-suggestion"
          key={`${suggestion.lat}-${suggestion.lon}-${index}`}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => selectSuggestion(suggestion)}
        >

          <MapPin size={17} />

          <span className="suggestion-content">

            <strong>
              {suggestion.name}
            </strong>

            <small>
              {[
                suggestion.state,
                suggestion.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </small>

          </span>

        </button>
      ))}

    </div>
  )}

</div>

              <Button
                type="submit"
                disabled={loading}
              >

                {loading ? (
                  <LoaderCircle
                    className="spin"
                    size={20}
                  />
                ) : (
                  <Search size={20} />
                )}

                {loading ? "Searching..." : "Search"}

              </Button>

            </form>

            {/* LOCATION BUTTON */}

            <button
              className="location-button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
            >

              {locationLoading ? (
                <LoaderCircle
                  size={17}
                  className="spin"
                />
              ) : (
                <Navigation size={17} />
              )}

              {locationLoading
                ? "Finding location..."
                : "Use my current location"}

            </button>

            {/* ERROR */}

            {error && (
  <div className="error-message" role="alert">

    <div className="error-content">
      <strong>Unable to load weather</strong>
      <span>{error}</span>
    </div>

    <button
      type="button"
      className="error-retry-button"
      onClick={() => {
        if (city.trim()) {
          fetchWeather(city);
        } else {
          getCurrentLocation();
        }
      }}
    >
      <RefreshCw size={15} />
      Retry
    </button>

  </div>
)}

            {/* RECENT SEARCHES */}

            {recentCities.length > 0 && (
              <div className="recent-section">

                <div className="recent-header">
                  <span>
                    <Heart size={15} />
                    Recent searches
                  </span>
                </div>

                <div className="recent-list">

                  {recentCities.map((recentCity) => (
                    <div
                      className="recent-city"
                      key={recentCity}
                    >

                      <button
                        onClick={() => {
                          setCity(recentCity);
                          fetchWeather(recentCity);
                        }}
                      >
                        <MapPin size={15} />
                        {recentCity}
                      </button>

                      <button
                        className="remove-city"
                        onClick={() =>
                          removeRecentCity(recentCity)
                        }
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* FAVORITE CITIES */}

{favorites.length > 0 && (
  <div className="favorites-section">

    <div className="recent-header">
      <span>
        <Heart size={15} fill="currentColor" />
        Favorite cities
      </span>

      <small>
        {favorites.length}/10
      </small>
    </div>

    <div className="favorite-list">

      {favorites.map((favoriteCity) => (
        <div
          className="favorite-city-card"
          key={favoriteCity}
        >

          {/* OPEN CITY */}

          <button
            type="button"
            className="favorite-city-main"
            onClick={() => {
              setCity(favoriteCity);
              fetchWeather(favoriteCity);
            }}
          >

            <div className="favorite-city-icon">
              <MapPin size={18} />
            </div>

            <div className="favorite-city-info">

              <strong>
                {favoriteCity}
              </strong>

              <span>
                Click to view weather
              </span>

            </div>

          </button>


          {/* REMOVE */}

          <button
            type="button"
            className="favorite-remove"
            onClick={() => {

              setFavorites((previous) => {

                const updated = previous.filter(
                  (item) =>
                    item.toLowerCase() !==
                    favoriteCity.toLowerCase()
                );

                localStorage.setItem(
                  "favoriteCities",
                  JSON.stringify(updated)
                );

                return updated;
              });

            }}
            title={`Remove ${favoriteCity} from favorites`}
            aria-label={`Remove ${favoriteCity} from favorites`}
          >

            <Trash2 size={16} />

          </button>

        </div>
      ))}

    </div>

  </div>
)}

            {/* LOADING STATE */}

            {loading && (
              <div className="weather-loading" role="status" aria-live="polite">
                <LoaderCircle size={38} className="loading-spinner" />
                <strong>Getting latest weather...</strong>
                <span>Please wait a moment</span>
              </div>        
            )}

            {/* WEATHER */}

            {weather && (
              <section className="weather-result">
                    
                {weatherAlert && (
  <div className={`weather-alert ${weatherAlert.type}`}>

    <div className="weather-alert-icon">
      {weatherAlert.icon}
    </div>

    <div className="weather-alert-content">
      <strong>
        {weatherAlert.title}
      </strong>

      <p>
        {weatherAlert.message}
      </p>
    </div>

  </div>
)}

                {/* LOCATION */}

                <div className="weather-top">

                  <div className="location">

                    <MapPin size={18} />

                    <span>
                      {weather.name},{" "}
                      {weather.sys.country}
                    </span>

                    <button
                      className={`favorite-button ${isFavorite ? "active" : ""}`}
                      onClick={toggleFavorite}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                  </div>

                  <button
                    className="refresh-button"
                    onClick={refreshWeather}
                    disabled={loading}
                    title="Refresh weather"
                  >
                    <RefreshCw
                      size={19}
                      className={
                        loading ? "spin" : ""
                      }
                    />
                  </button>

                </div>

                {/* MAIN WEATHER */}

                <div className="main-weather">

                  <div className="weather-icon">
                    {getWeatherIcon(
                      weather.weather[0].main,
                      70
                    )}
                  </div>

                  <div>

                    <div className="temperature">

                      {getTemperature(
                        weather.main.temp,
                        unit
                      )}

                      <span>°{unit}</span>

                    </div>

                    <p className="condition">
                      {weather.weather[0].description}
                    </p>

                    <p className="feels-like">
                      Feels like{" "}
                      {getTemperature(
                        weather.main.feels_like,
                        unit
                      )}
                      °{unit}
                    </p>

                    {lastUpdated && (
                      <p className="last-updated">
                        Last updated {lastUpdated.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}

                  </div>

                </div>

                {/* UNIT TOGGLE */}

                <div className="unit-toggle">

                  <button
                    className={
                      unit === "C" ? "active" : ""
                    }
                    onClick={() => setUnit("C")}
                  >
                    °C
                  </button>

                  <button
                    className={
                      unit === "F" ? "active" : ""
                    }
                    onClick={() => setUnit("F")}
                  >
                    °F
                  </button>

                </div>

                {/* HOURLY FORECAST */}

                {hourlyForecast.length > 0 && (
                  <section className="forecast-section">
                    <div className="section-title">
                      <div>
                        <CalendarDays size={19} />
                        <h2>Hourly Forecast</h2>
                      </div>
                    </div>

                    <div className="hourly-scroll">
                      {hourlyForecast.map((item) => (
                        <div className="hour-card" key={item.dt}>
                          <span className="hour-time">{getHour(item.dt_txt)}</span>
                          <div className="forecast-icon">
                            {getForecastIcon(item.weather[0].main, 30)}
                          </div>
                          <strong>{getTemperature(item.main.temp, unit)}°</strong>
                    <div className="rain-probability">
                      <Droplets size={12} />

                      <span>
                       {Math.round((item.pop || 0) * 100)}%
                      </span>
                    </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 5-DAY FORECAST */}

                {dailyForecast.length > 0 && (
                  <section className="forecast-section">
                    <div className="section-title">
                      <div>
                        <CalendarDays size={19} />
                        <h2>5-Day Forecast</h2>
                      </div>
                    </div>

                    <div className="daily-forecast">
                      {dailyForecast.map((day, index) => (
                        <div className="day-card" key={day.date}>
                          <div className="day-name">
                            {index === 0 ? "Today" : getDayName(day.date)}
                          </div>
                          <div className="day-weather-icon">
                            {getForecastIcon(day.condition, 38)}
                          </div>
                          <div className="day-condition">{day.description}</div>
                          <div className="day-temperature">
                            <strong>{getTemperature(day.max, unit)}°</strong>
                            <span>{getTemperature(day.min, unit)}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* TEMPERATURE TREND */}

                {temperatureData.length > 0 && (
                  <section className="forecast-section">
                    <div className="section-title">
                      <div>
                        <Thermometer size={19} />
                        <h2>Temperature Trend</h2>
                      </div>
                    </div>

                    <div className="temperature-chart">
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={temperatureData}>
                          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                          <YAxis unit="°" width={35} tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(value) => [`${value}°`, "Temperature"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                )}

                {/* DETAILS */}

                <div className="weather-details">

                  <div className="detail-card">

                    <Droplets size={22} />

                    <span>Humidity</span>

                    <strong>
                      {weather.main.humidity}%
                    </strong>

                  </div>

                  <div className="detail-card">

                    <Wind size={22} />

                    <span>Wind</span>

                    <strong>
                      {weather.wind.speed} m/s
                    </strong>

                  </div>

                  <div className="detail-card">

                    <Eye size={22} />

                    <span>Visibility</span>

                    <strong>
                      {(
                        weather.visibility / 1000
                      ).toFixed(1)}{" "}
                      km
                    </strong>

                  </div>

                  <div className="detail-card">

                    <Gauge size={22} />

                    <span>Pressure</span>

                    <strong>
                      {weather.main.pressure} hPa
                    </strong>

                  </div>

                  <div className="detail-card precipitation-card">

  <Droplets size={22} />

  <span>Rain Chance</span>

  <strong>
    {hourlyForecast.length > 0
      ? Math.round(
          Math.max(
            ...hourlyForecast.map(
              (item) => (item.pop || 0) * 100
            )
          )
        )
      : 0}
    %
  </strong>

</div>

                </div>

                {/* AIR QUALITY */}

{airQuality?.list?.[0] && (
  <section className="air-quality-card">

    <div className="air-quality-header">

      <div>
        <span className="air-quality-label">
          AIR QUALITY
        </span>

        <h3>
          Air Quality Index
        </h3>
      </div>

      <div
        className={`aqi-badge ${
          getAQIInfo(
            airQuality.list[0].main.aqi
          ).className
        }`}
      >
        {getAQIInfo(
          airQuality.list[0].main.aqi
        ).label}
      </div>

    </div>


    <div className="aqi-main">

      <div
        className={`aqi-number ${
          getAQIInfo(
            airQuality.list[0].main.aqi
          ).className
        }`}
      >
        {airQuality.list[0].main.aqi}
      </div>

      <div className="aqi-description">

        <strong>
          {getAQIInfo(
            airQuality.list[0].main.aqi
          ).label} air quality
        </strong>

        <span>
          {getAQIInfo(
            airQuality.list[0].main.aqi
          ).description}
        </span>

      </div>

    </div>


    <div className="pollutant-grid">

      <div className="pollutant-item">
        <span>PM2.5</span>
        <strong>
          {airQuality.list[0].components.pm2_5.toFixed(1)}
        </strong>
        <small>μg/m³</small>
      </div>

      <div className="pollutant-item">
        <span>PM10</span>
        <strong>
          {airQuality.list[0].components.pm10.toFixed(1)}
        </strong>
        <small>μg/m³</small>
      </div>

      <div className="pollutant-item">
        <span>NO₂</span>
        <strong>
          {airQuality.list[0].components.no2.toFixed(1)}
        </strong>
        <small>μg/m³</small>
      </div>

      <div className="pollutant-item">
        <span>CO</span>
        <strong>
          {airQuality.list[0].components.co.toFixed(1)}
        </strong>
        <small>μg/m³</small>
      </div>

    </div>

  </section>
)}

                {/* SUN */}

                {/* SUN CYCLE */}

<div className="sun-cycle-card">

  <div className="sun-cycle-header">

    <div>
      <span className="sun-cycle-label">
        DAYLIGHT
      </span>

      <h3>
        Sun cycle
      </h3>
    </div>

    <div className="sun-cycle-icon">
      <Sun size={22} />
    </div>

  </div>


  <div className="sun-cycle-visual">

    <div className="sun-arc">

      <div className="sun-orbit" />

      <div className="sun-position">
        <Sun size={18} />
      </div>

    </div>


    <div className="sun-cycle-times">

      <div className="sun-time sunrise-time">

        <Sunrise size={18} />

        <div>
          <span>
            Sunrise
          </span>

          <strong>
            {weather
              ? formatTime(
                  weather.sys.sunrise,
                  weather.timezone
                )
              : "--"}
          </strong>
        </div>

      </div>


      <div className="sun-time sunset-time">

        <Sunset size={18} />

        <div>
          <span>
            Sunset
          </span>

          <strong>
            {weather
              ? formatTime(
                  weather.sys.sunset,
                  weather.timezone
                )
              : "--"}
          </strong>
        </div>

      </div>

    </div>

  </div>


  <div className="daylight-status">

    <Moon size={14} />

    <span>
      Daylight cycle
    </span>

    <strong>
      {weather
        ? `${Math.max(
            0,
            Math.round(
              (weather.sys.sunset -
                weather.sys.sunrise) /
                3600
            )
          )}h daylight`
        : "--"}
    </strong>

  </div>

</div>

              </section>
            )}

            {/* EMPTY */}

            {!weather &&
              !loading &&
              !error && (
                <div className="empty-state">

                  <Cloud size={70} />

                  <h2>
                    Check the weather
                  </h2>

                  <p>
                    Search for a city or use your
                    current location.
                  </p>

                </div>
              )}

          </CardContent>
        </Card>

        <footer>
          Weather data powered by OpenWeather
        </footer>

      </div>
    </main>
  );
}