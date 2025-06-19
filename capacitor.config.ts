import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.f23baceb47f84aafad2c324d0946905a',
  appName: 'ola-web-android-moderno',
  webDir: 'dist',
  server: {
    url: 'https://f23baceb-47f8-4aaf-ad2c-324d0946905a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#3B82F6'
    }
  }
};

export default config;
