import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Header from './header';
import ProfileInfo from './profileinfo';
import OptionList from './optionlist';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header />
      
      {/* Profile Info */}
      <ProfileInfo />
      
      {/* Menu Options */}
      <OptionList />
      
      {/* Additional profile content coming soon */}
      
    </SafeAreaView>
  );
}
