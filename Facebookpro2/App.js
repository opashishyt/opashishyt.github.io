import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import UpdateManager from './src/components/UpdateManager';
import { COLORS } from './src/utils/constants';

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UpdateManager>
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <AppNavigator />
          </SafeAreaView>
        </UpdateManager>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;