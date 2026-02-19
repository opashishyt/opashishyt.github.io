import React, { useEffect } from 'react';
import { View } from 'react-native';
import updateService from '../services/updateService';

const UpdateManager = ({ children }) => {
  useEffect(() => {
    // Check for updates on component mount
    updateService.checkOnStart();
    
    // Start periodic checks
    updateService.startPeriodicChecks(24); // Check every 24 hours

    return () => {
      // Cleanup
      updateService.stopPeriodicChecks();
    };
  }, []);

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default UpdateManager;