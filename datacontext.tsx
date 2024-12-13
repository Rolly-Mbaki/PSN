import React, { useEffect, useState } from 'react';
import { Game } from './types';

export interface DataContext {
    games: Game[];
    loading: boolean;
    loadData: () => void;
}

export const DataContext = React.createContext<DataContext>({ games: [], loading: false, loadData: () => { } });

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const headers = {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvbGx5Lm1iYWtpQGFwLmJlIiwiaWF0IjoxNzMzMzYyMTIzfQ.rxGcugs7UeRhEM1hccxZOr9iaXywxvWBGei5CUCWp_g",
      };
      const baseURL = "https://sampleapis.assimilate.be/playstation/games";
    
      const loadData = async () => {
        try {
          setLoading(true);
          const response = await fetch(baseURL, { headers });
          const data: Game[] = await response.json();
          setGames(data);
        } catch (error) {
          console.error("Failed to fetch games:", error);
        }
        setLoading(false);
      };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ games: games, loadData: loadData, loading: loading}}>
            {children}
        </DataContext.Provider>
    )
}