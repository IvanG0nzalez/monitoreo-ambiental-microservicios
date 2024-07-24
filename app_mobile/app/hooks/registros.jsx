import { useEffect, useState, useCallback } from "react";
import { METHOD_GET } from "../utils/api";

export const useQueryRegistryDataDay = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSensors = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await METHOD_GET("/registros/listar/hoy");
            setData(response);
            setError(null);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching data');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSensors();
    }, [fetchSensors]);

    const refetch = () => {
        setIsLoading(true);
        fetchSensors();
    };

    return { data, isLoading, error, refetch };
};