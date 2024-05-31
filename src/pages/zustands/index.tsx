import { useState } from "react";
// import AddTodoForm from "../../components/todo/AddTodoForm";
// import TodoList from "../../components/todo/TodoList";
import useWeatherStore from "../../stores/useWeatherStore";
import WeatherDisplay from "../../components/weather/WeatherDisplay";
import { TextInput, Button,Group } from "@mantine/core";

export const Zust = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { fetchWeather } = useWeatherStore();

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = () => {
        if (searchTerm) {
            useWeatherStore.getState().setCity(searchTerm);
            fetchWeather();
            setSearchTerm("");
        }
    };

    return (
        <div className="App">
            <h1>Weather App</h1>
            <Group align="center" mt="md" mb="xs">
                <TextInput
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Enter city name"
                />
                <Button onClick={handleSubmit}>Search</Button>
            </Group>
            <WeatherDisplay />
        </div>
    );
};
