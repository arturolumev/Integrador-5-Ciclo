import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/data')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Proyecto React Native y Express</Text>
      {data && <Text>{data.message}</Text>}
    </View>
  );
}

export default App;
