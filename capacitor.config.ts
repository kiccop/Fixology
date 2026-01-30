import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.mybikelog',
  appName: 'MyBikelog',
  webDir: '.next',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://mybikelog.app',
    cleartext: true // Allow http for development
  }
};

export default config;
