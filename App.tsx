import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Home from './src/Components/Containers/Home';

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Home />
    </SafeAreaView>
  );
};

export default App;
