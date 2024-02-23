import './App.css'
import Temperature from "./components/Temperature.jsx";
import Highlights from "./components/Highlights.jsx";
import {useEffect, useState} from "react";

function App() {
    const [city, setCity] = useState("Warsaw");
    const [delayedCity, setDelayedCity] = useState(city);
    const [weatherData, setWeatherData] = useState(null);

    const apiURL = `https://api.weatherapi.com/v1/current.json?key=b8118ded294c42c1adc174209242202&q=${city}&aqi=no`;

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDelayedCity(city);
        }, 500);

        return () => clearTimeout(timerId);

    }, [city]);

    useEffect(() => {
        fetch(apiURL)
            .then((response) => {
                if(!response.ok){
                    throw new Error("Error");
                }
                return response.json();
            })
            .then((data) => {
                setWeatherData(data);
                console.log(data.current.isDay);
            })
            .catch((e) => {
                console.log(e);
            })
    }, [delayedCity]);


  return (
    <div className='bg-[#1F213A] h-screen flex justify-center align-top'>
        <div className='mt-40 w-1/5 h-1/3'>
            <Temperature
                setCity={setCity}
                stats={{
                    temp: weatherData?.current?.temp_c ?? 'Loading...',
                    condition: weatherData?.current?.condition?.text ?? 'Loading...',
                    isday: weatherData?.current?.isDay ?? 'Loading...',
                    location: weatherData?.location?.name ?? 'Loading...',
                    time: weatherData?.location?.localtime ?? 'Loading...'
                }}
            />

        </div>
        <div className='mt-40 w-1/3 h-1/3 p-10 grid grid-cols-2 gap-6'>
            <h2 className='text-slate-200 text-2xl col-span-2'>Today's Highlights</h2>
            {
                weatherData &&
                (
                    <>
                        <Highlights
                        stats={{
                            title:"Wind Status",
                            value:weatherData.current.wind_mph,
                            unit:"mph",
                            direction:weatherData.current.wind_dir
                        }}
                        />
                        <Highlights
                            stats={{
                                title:"Humidity",
                                value:weatherData.current.humidity,
                                unit:"%",
                            }}
                        />
                        <Highlights
                            stats={{
                                title:"Visibility",
                                value:weatherData.current.vis_miles,
                                unit:"miles",
                            }}
                        />
                        <Highlights
                            stats={{
                                title:"Air Pressure",
                                value:weatherData.current.pressure_mb,
                                unit:"mb",
                            }}
                        />
                    </>
                )
            }

        </div>
    </div>
  )
}

export default App
