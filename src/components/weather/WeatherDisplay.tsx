import useWeatherStore from "../../stores/useWeatherStore";
import { Card, Text, Badge, Group, Grid } from "@mantine/core";
import { IconTemperature, IconTemperaturePlus } from "@tabler/icons-react";

const WeatherDisplay = () => {
    const { weatherData, loading, error } = useWeatherStore();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    if (weatherData) {
        const {
            name,
            main: { temp, feels_like },
            weather: [{ main: description }],
        } = weatherData;
        
        const tempInCelsius = Math.round(temp - 273.15);
        const feelsLikeTempInCelsius = Math.round(feels_like - 273.15);

        return (
            <Grid>
                <Grid.Col span={2}>
                    <Card shadow="sm" radius="md" withBorder>
                        <Group
                            align="center"
                            mt="md"
                            mb="xs"
                        >
                            <Text fw={500}>{name}</Text>
                            <Badge color="yellow">{description}</Badge>
                        </Group>
                        <Group
                            align="center"
                            mt="md"
                            mb="xs"
                        >
                            <IconTemperature />
                            <Text>{tempInCelsius} °C</Text>
                        </Group>
                        <Group
                            align="center"
                            mt="md"
                            mb="xs"
                        >
                            <IconTemperaturePlus />
                            Feels Like: {feelsLikeTempInCelsius} °C
                        </Group>
                    </Card>
                </Grid.Col>
            </Grid>
        );
    } else {
        return <p>No weather data yet.</p>;
    }

};

export default WeatherDisplay;
