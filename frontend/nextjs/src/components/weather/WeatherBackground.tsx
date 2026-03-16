'use client';

import { CurrentWeather } from '@/types/weather';

interface WeatherBackgroundProps {
  weather: CurrentWeather | null;
  isLoading: boolean;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

function getBackgroundClass(condition: string, timeOfDay: string): string {
  const conditionLower = condition.toLowerCase();
  const isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';
  const isEvening = timeOfDay === 'evening';
  
  if (conditionLower.includes('clear')) {
    if (isDay) return 'bg-sunny';
    if (isEvening) return 'bg-evening';
    return 'bg-starry-night';
  }
  if (conditionLower.includes('cloud')) {
    return isDay ? 'bg-cloudy-day' : 'bg-cloudy-night';
  }
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return isDay ? 'bg-rainy-day' : 'bg-rainy-night';
  }
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return 'bg-stormy';
  }
  if (conditionLower.includes('snow')) {
    return isDay ? 'bg-snowy-day' : 'bg-snowy-night';
  }
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return 'bg-foggy';
  }
  
  if (isDay) return 'bg-sunny';
  if (isEvening) return 'bg-evening';
  return 'bg-starry-night';
}

export function WeatherBackground({ weather, isLoading }: WeatherBackgroundProps) {
  const timeOfDay = getTimeOfDay();
  const isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';
  
  const backgroundClass = weather 
    ? getBackgroundClass(weather.condition, timeOfDay)
    : 'bg-default';

  const condition = weather?.condition.toLowerCase() || '';

  return (
    <div className={`weather-background ${backgroundClass}`}>
      {weather && (
        <>
          {(condition.includes('clear') || condition.includes('cloud')) && isDay && (
            <>
              <div className="sun" />
              <div className="clouds">
                <div className="cloud cloud-1" />
                <div className="cloud cloud-2" />
                <div className="cloud cloud-3" />
              </div>
            </>
          )}
          
          {condition.includes('clear') && !isDay && (
            <>
              <div className="moon" />
              <div className="stars">
                {[...Array(80)].map((_, i) => (
                  <div 
                    key={i} 
                    className="star" 
                    style={{ 
                      left: `${Math.random() * 100}%`, 
                      top: `${Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      width: `${2 + Math.random() * 3}px`,
                      height: `${2 + Math.random() * 3}px`
                    }} 
                  />
                ))}
              </div>
            </>
          )}
          
          {condition.includes('snow') && (
            <>
              {isDay && <div className="sun" />}
              <div className="snowflakes">
                {[...Array(50)].map((_, i) => (
                  <div 
                    key={i} 
                    className="snowflake" 
                    style={{ 
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 7}s`,
                      animationDuration: `${5 + Math.random() * 5}s`,
                      width: `${4 + Math.random() * 6}px`,
                      height: `${4 + Math.random() * 6}px`
                    }} 
                  />
                ))}
              </div>
            </>
          )}
          
          {(condition.includes('rain') || condition.includes('drizzle')) && (
            <div className="rain">
              {[...Array(80)].map((_, i) => (
                <div 
                  key={i} 
                  className="raindrop" 
                  style={{ 
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    animationDuration: `${0.4 + Math.random() * 0.4}s`
                  }} 
                />
              ))}
            </div>
          )}
          
          {condition.includes('thunder') && (
            <div className="lightning" />
          )}
          
          {(condition.includes('mist') || condition.includes('fog')) && (
            <div className="mist">
              <div className="mist-layer" />
              <div className="mist-layer" style={{ animationDelay: '-15s', opacity: 0.7 }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
