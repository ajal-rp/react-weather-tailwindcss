import { Component } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaGlobeAmericas,
  FaTint,
  FaEye,
  FaWind,
  FaSun,
  FaMoon,
  FaChartBar,
  FaCloud,
} from "react-icons/fa";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      weather: null,
      error: null,
    };
    this.currentDate = new Date().toLocaleDateString("en-UD", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && this.state.error !== prevState.error) {
      toast.error(this.state.error, {
        toastId: "weather-error",
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  }
  fetchWeatherData = () => {
    const { city } = this.state;

    if (!city) return;

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error("Missing OpenWeather API Key in environment variables.");
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `couldn't fetch th weather data for the city ${city}`
          );
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ weather: data, error: null });
      })
      .catch((error) => {
        this.setState({ error: error.message, weather: null });
      });
  };

  handleCityNameInputChange = (e) => {
    this.setState({ city: e.target.value });
  };

  handleWeatherDataSubmit = (e) => {
    e.preventDefault();
    this.fetchWeatherData();
  };

  render() {
    const { city, weather } = this.state;

    return (
      <div className="min-h-screen max-w-7xl mx-auto mt-10 w-full bg-white shadow-lg rounded-lg p-6">
        <ToastContainer />

        <h2 className="text-3xl font-bold mb-6 text-center text-slate-700 underline">
          Today Weather
        </h2>

        {/* Location and Date Info */}
        <div className="flex justify-center items-center gap-4 mb-6 text-slate-600 text-lg">
          <div className="flex items-center gap-2">
            <FaGlobeAmericas />
            {weather ? weather.name : "---/---"},{" "}
            {weather?.sys?.country || "--"}
          </div>
          <span>|</span>
          <div className="flex items-center gap-2">
            <FaSun />
            {this.currentDate}
          </div>
        </div>

        {/* Weather Info Cards */}
        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Humidity + Visibility */}
            <div className="rounded-xl bg-slate-50 p-5 shadow hover:shadow-lg text-center">
              <h2 className="text-slate-600 text-xl font-semibold mb-2">
                Humidity
              </h2>
              <p className="text-2xl font-bold text-blue-500 flex justify-center items-center gap-2">
                <FaTint />
                {weather.main.humidity}%
              </p>

              <h2 className="text-slate-600 text-xl font-semibold mt-6 mb-2">
                Visibility
              </h2>
              <p className="text-2xl font-bold text-blue-500 flex justify-center items-center gap-2">
                <FaEye />
                {(weather.visibility / 1000).toFixed(1)} km
              </p>
            </div>

            {/* Wind + Sunrise/Sunset */}
            <div className="rounded-xl bg-slate-50 p-5 shadow hover:shadow-lg text-center">
              <h2 className="text-slate-600 text-xl font-semibold mb-2">
                Wind Speed
              </h2>
              <p className="text-2xl font-bold text-blue-500 flex justify-center items-center gap-2">
                <FaWind />
                {weather.wind.speed} m/s
              </p>

              <div className="mt-6">
                <p className="text-lg text-slate-600 flex items-center justify-center gap-2">
                  <FaSun />
                  Sunrise:{" "}
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-lg text-slate-600 flex items-center justify-center gap-2">
                  <FaMoon />
                  Sunset:{" "}
                  {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Pressure + Clouds */}
            <div className="rounded-xl bg-slate-50 p-5 shadow hover:shadow-lg text-center">
              <h2 className="text-slate-600 text-xl font-semibold mb-2">
                Pressure
              </h2>
              <p className="text-2xl font-bold text-blue-500 flex justify-center items-center gap-2">
                <FaChartBar />
                {weather.main.pressure} hPa
              </p>

              <h2 className="text-slate-600 text-xl font-semibold mt-6 mb-2">
                Cloud Cover
              </h2>
              <p className="text-2xl font-bold text-blue-500 flex justify-center items-center gap-2">
                <FaCloud />
                {weather.clouds.all}%
              </p>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="flex justify-center items-center mt-8 max-w-lg mx-auto">
          <form
            className="w-full flex gap-3"
            onSubmit={this.handleWeatherDataSubmit}
          >
            <input
              type="text"
              value={city}
              placeholder="Enter city name"
              onChange={this.handleCityNameInputChange}
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Get Weather
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default App;
