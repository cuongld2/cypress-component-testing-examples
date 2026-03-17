package main

import (
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type CurrentWeatherResponse struct {
	City        string  `json:"city"`
	Country     string  `json:"country"`
	Temperature float64 `json:"temperature"`
	Condition   string  `json:"condition"`
	Humidity    int     `json:"humidity"`
	WindSpeed   float64 `json:"wind_speed"`
	FeelsLike   float64 `json:"feels_like"`
	Icon        string  `json:"icon"`
}

type ForecastDay struct {
	Date          string  `json:"date"`
	TempMax       float64 `json:"temp_max"`
	TempMin       float64 `json:"temp_min"`
	Condition     string  `json:"condition"`
	Icon          string  `json:"icon"`
	Precipitation int     `json:"precipitation"`
}

type ForecastResponse struct {
	City     string        `json:"city"`
	Country  string        `json:"country"`
	Forecast []ForecastDay `json:"forecast"`
}

type HistoryDay struct {
	Date        string  `json:"date"`
	Temperature float64 `json:"temperature"`
	Condition   string  `json:"condition"`
	Humidity    int     `json:"humidity"`
	WindSpeed   float64 `json:"wind_speed"`
	Icon        string  `json:"icon"`
}

type HistoryResponse struct {
	City    string       `json:"city"`
	Country string       `json:"country"`
	History []HistoryDay `json:"history"`
}

var conditions = []string{"Clear", "Clouds", "Rain", "Snow", "Thunderstorm", "Mist"}
var icons = []string{"01d", "02d", "10d", "13d", "11d", "50d"}

var cityCountries = map[string]string{
	"London":        "GB",
	"New York":      "US",
	"Tokyo":         "JP",
	"Paris":         "FR",
	"Berlin":        "DE",
	"Sydney":        "AU",
	"Toronto":       "CA",
	"Mumbai":        "IN",
	"Beijing":       "CN",
	"Madrid":        "ES",
	"Rome":          "IT",
	"Amsterdam":     "NL",
	"Bangkok":       "TH",
	"Singapore":     "SG",
	"Dubai":         "AE",
	"Seoul":         "KR",
	"Shanghai":      "CN",
	"Hong Kong":     "HK",
	"Moscow":        "RU",
	"Cairo":         "EG",
	"Vienna":        "AT",
	"Zurich":        "CH",
	"Stockholm":     "SE",
	"Copenhagen":    "DK",
	"Oslo":          "NO",
	"Helsinki":      "FI",
	"Warsaw":        "PL",
	"Prague":        "CZ",
	"Budapest":      "HU",
	"Athens":        "GR",
	"Lisbon":        "PT",
	"Dublin":        "IE",
	"Brussels":      "BE",
	"Vancouver":     "CA",
	"San Francisco": "US",
	"Los Angeles":   "US",
	"Chicago":       "US",
	"Miami":         "US",
	"Boston":        "US",
	"Seattle":       "US",
	"Melbourne":     "AU",
	"Brisbane":      "AU",
	"Perth":         "AU",
	"Auckland":      "NZ",
	"Wellington":    "NZ",
	"Jakarta":       "ID",
	"Kuala Lumpur":  "MY",
	"Manila":        "PH",
	"Hanoi":         "VN",
	"Ho Chi Minh":   "VN",
	"Tel Aviv":      "IL",
	"Riyadh":        "SA",
	"Jeddah":        "SA",
	"Doha":          "QA",
	"Muscat":        "OM",
	"Nairobi":       "KE",
	"Cape Town":     "ZA",
	"Lagos":         "NG",
	"Mexico City":   "MX",
	"Sao Paulo":     "BR",
	"Buenos Aires":  "AR",
	"Santiago":      "CL",
	"Lima":          "PE",
	"Bogota":        "CO",
}

func getCountry(city string) string {
	// First try exact match
	if country, ok := cityCountries[city]; ok {
		return country
	}
	// Try case-insensitive match
	for name, country := range cityCountries {
		if strings.EqualFold(name, city) {
			return country
		}
	}
	return "US"
}

func randomFloat(min, max float64) float64 {
	return min + rand.Float64()*(max-min)
}

func randomInt(min, max int) int {
	return rand.Intn(max-min+1) + min
}

func getRandomCondition() (string, string) {
	idx := rand.Intn(len(conditions))
	return conditions[idx], icons[idx]
}

func getCurrentWeather(c *gin.Context) {
	city := c.DefaultQuery("city", "New York")

	condition, icon := getRandomCondition()

	response := CurrentWeatherResponse{
		City:        city,
		Country:     getCountry(city),
		Temperature: randomFloat(10, 35),
		Condition:   condition,
		Humidity:    randomInt(30, 90),
		WindSpeed:   randomFloat(0, 20),
		FeelsLike:   randomFloat(8, 38),
		Icon:        icon,
	}

	c.JSON(http.StatusOK, response)
}

func getForecast(c *gin.Context) {
	city := c.DefaultQuery("city", "New York")

	forecast := make([]ForecastDay, 5)
	baseDate := time.Now()

	for i := 0; i < 5; i++ {
		condition, icon := getRandomCondition()
		forecast[i] = ForecastDay{
			Date:          baseDate.AddDate(0, 0, i+1).Format("2006-01-02"),
			TempMax:       randomFloat(20, 35),
			TempMin:       randomFloat(10, 20),
			Condition:     condition,
			Icon:          icon,
			Precipitation: randomInt(0, 100),
		}
	}

	response := ForecastResponse{
		City:     city,
		Country:  getCountry(city),
		Forecast: forecast,
	}

	c.JSON(http.StatusOK, response)
}

func getHistory(c *gin.Context) {
	city := c.DefaultQuery("city", "New York")

	history := make([]HistoryDay, 7)
	baseDate := time.Now()

	for i := 0; i < 7; i++ {
		condition, icon := getRandomCondition()
		history[i] = HistoryDay{
			Date:        baseDate.AddDate(0, 0, -(i + 1)).Format("2006-01-02"),
			Temperature: randomFloat(10, 30),
			Condition:   condition,
			Humidity:    randomInt(30, 90),
			WindSpeed:   randomFloat(0, 20),
			Icon:        icon,
		}
	}

	response := HistoryResponse{
		City:    city,
		Country: getCountry(city),
		History: history,
	}

	c.JSON(http.StatusOK, response)
}

func main() {
	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/api/weather/current", getCurrentWeather)
	r.GET("/api/weather/forecast", getForecast)
	r.GET("/api/weather/history", getHistory)

	r.Run(":8080")
}
