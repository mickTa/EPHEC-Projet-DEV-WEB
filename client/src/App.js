import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getData } from "./api"; // Assure-toi que api.js est bien créé dans src

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>Données récupérées : {JSON.stringify(data)}</Text>
    </View>
  );
};

export default App;
