import React, { useEffect, useState } from 'react'
import './WeatherApp.css'
import axios from 'axios';

import search_icon from '../Assets/search.png'
import clear_icon  from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import humidity_icon from '../Assets/humidity.png'



function WeatherApp() {

    const API_KEY = process.env.REACT_APP_API_KEY;
    const API_URL = process.env.REACT_APP_API_URL;

    const [city,SetCity]=useState("")
    const [data, setData] = useState({})
    const [lat, setLat] = useState([]);
    const [lon, setLon] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('')



    useEffect(()=>{
        const fetchData = async () => {
            navigator.geolocation.getCurrentPosition(function (position) {
              setLat(position.coords.latitude);
              setLon(position.coords.longitude);
            });
        axios.get(`${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`).then((res)=>{

            const weatherConditionToImage = {
                Clouds: cloud_icon,
                Clear: clear_icon,
                Rain: rain_icon,
                Drizzle: drizzle_icon,
                Mist: snow_icon,
            };
            
            const weatherMain = res.data.weather[0].main;
            const image = weatherConditionToImage[weatherMain] || cloud_icon;
            
       setData({
            ...data,
            celcius: res.data.main.temp,
            name: res.data.name,
            humidity: res.data.main.humidity,
            speed: res.data.wind.speed,
            image 
        });
        

    }).catch((error)=>{
        console.log(error);
    })

        
}
fetchData()
},[lat,lon])


    const handleInputChange = (e) => {
        const cityName = e.target.value;
        SetCity(cityName);

        if (cityName !== "") {
            axios
                .get(`${API_URL}/find?q=${cityName}&appid=${API_KEY}&units=metric`)
                .then((res) => {
                    const suggestions=res.data.list.map(item=>item.name);
                    setSuggestions(suggestions)
                })
                .catch((err) => {
               
                    // setError('Error fetching weather data');
                    setSuggestions([]);
                });
        }
    }

    const handleClick = (e) => {
        e.preventDefault()
        if(city!==''){
            axios
                .get(`${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`).then((res)=>{

                    const weatherConditionToImage = {
                        Clouds: cloud_icon,
                        Clear: clear_icon,
                        Rain: rain_icon,
                        Drizzle: drizzle_icon,
                        Mist: snow_icon,
                    };
                    
                    const weatherMain = res.data.weather[0].main;
                    const image = weatherConditionToImage[weatherMain] || cloud_icon;


                    setSuggestions([]);
                    setData({
                        ...data,
                        celcius: res.data.main.temp,
                        name: res.data.name,
                        humidity: res.data.main.humidity,
                        speed: res.data.wind.speed,
                        image 
                    });
                    

                }).catch((error)=>{
                    setSuggestions([]);
                    if (error.response.status === 404) {
                      setError("Invalid City Name")
                    } else {
                      setError('')
                    }
                    console.log(error)
                })
    }}

  return (
    <div class='container shadow-2xl '>
        <div className=' flex justify-center gap-2  pt-14'>

<div className='relative'>
<input
        type="text"
        placeholder='Enter City Name..'
        value={city}
        onChange={handleInputChange}
        className='w-96 h-10 bg-[#ebfffc] border-none outline-none text-center  rounded-3xl pl-2 pr-10 text-gray-500 font-normal'
    />
    {city !== '' && (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="gray"
            className="w-6 h-6 absolute right-3 top-2 cursor-pointer"
            onClick={() =>{ SetCity('')
            setError('')}}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
     )} 
</div>






            <div  className='flex justify-center items-center w-10 h-10 bg-[#ebfffc] rounded-3xl cursor-pointer text-gray-500'>
              <img src={search_icon} alt="" onClick={handleClick} />
            </div>

        </div>
        <div className='suggestion relative'>
  {suggestions.length > 0 && (
    <div className='suggestion-main absolute z-10 w-full '>
      {suggestions.map((suggestion, index) => (
        <div key={index} className=''>
          <div
            className='text-white bg-blue-500 bg-opacity-50  ml-5 rounded-full mr-16 mt-1 py-2 px-4 cursor-pointer hover:bg-blue-600'
            onClick={() => {SetCity(suggestion)
            setSuggestions([])}}
          >
            {suggestion}
          </div>
        
        </div>
      ))}
    </div>
  )}
</div>
<div className="error flex gap-2 justify-center text-yellow-300 font-light mt-2">
{error!==""&&<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
</svg>}
 <p>{error}</p>
        </div>
        
        <div className='mt-7 flex justify-center'>
            <img src={data.image} alt="" />
        </div>
        <div className='flex justify-center mt-2 text-white text-6xl font-normal'>
            {data.celcius}°c
        </div>
        <div className='justify-center mt-2 text-white text-3xl font-normal '>{data.name}</div>

       <div className='mt-16 text-white flex  justify-around '>
       <div className='flex justify-start gap-3 '>
                <img src={humidity_icon} alt="humidity" className='w-6 h-6 mt-2' />
                <div className=' text-xl '>
                <div className='mt-1'>{data.humidity}</div>
                <div>Humidity</div>
            </div>
        </div>

        <div className='flex justify-start gap-3 '>
                <img src={wind_icon} alt="wind" className='w-6 h-6 mt-2'/>
                <div className=' text-xl '>
                <div className='mt-1'>{data.speed} km/h</div>
                <div>Wind Speed</div>
            </div>
        </div>
       </div>

    </div>
  )
}

export default WeatherApp
