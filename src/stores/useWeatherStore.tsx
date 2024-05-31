import { create } from "zustand";

const initialState = {
    
    city: "mumbai", // Store the current city
    weatherData: null, // Store the fetched weather data
    loading: false, // Flag for loading state
    error: null, // Store any errors during data fetching
};

const useWeatherStore = create((set) => ({
    ...initialState,
    setCity: (city) => set({ city }),
    fetchWeather: async () => {
        const { city } = useWeatherStore.getState();
        if (!city) return; // Don't fetch if no city is set

        set({ loading: true });
        try {
            const apiKey = "142f0919c55c7085e638741996480f39"; // Replace with your OpenWeatherMap API key
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
            );
            const data = await response.json();
            console.log(data);
            
            set({ weatherData: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useWeatherStore;
