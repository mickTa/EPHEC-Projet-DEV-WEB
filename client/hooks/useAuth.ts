import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
};

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        const response = await axios.get<User>(
          "http://localhost:3000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      }
    } catch (err) {
      console.error("Erreur récupération utilisateur :", err);
      setError("Impossible de récupérer les données utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post<{ token: string }>(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      await AsyncStorage.setItem("jwtToken", token);

      await fetchUser();
    } catch (err) {
      console.error("Erreur de connexion", err);
      setError("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, login, loading, error };
};

export default useAuth;
