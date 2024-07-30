import { METHOD_GET } from "../utils/api"
import { useState, useEffect } from 'react';
import { TIMEREFRESH } from "../constants/constants";

export const useQuerySensorsLastData = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await METHOD_GET("/sensores/ultimo_registro");
            setData(response.datos);
            setError(null);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching data');
            setData(null);
        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(fetchData, TIMEREFRESH);

        return () => clearInterval(intervalId);
    }, []);

    return { data, error };
};