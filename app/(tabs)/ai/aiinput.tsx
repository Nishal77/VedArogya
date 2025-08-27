import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Paperclip, Globe, Send } from 'lucide-react-native';

export default function AIInput() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSearchQuery('');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
      closeModal();
    }
  };

  const handleSend = () => {
    if (searchQuery.trim()) {
      // Handle send logic here
      console.log('Sending:', searchQuery);
      closeModal();
    }
  };

  return (
    <>
      {/* AI Input Button - Fixed at Bottom */}
      <View className="absolute bottom-6 left-4 right-4">
        <TouchableOpacity
          className="bg-gray-100 rounded-2xl p-4 shadow-lg shadow-black/10"
          activeOpacity={0.8}
          onPress={openModal}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-600 text-base font-medium">
                Ask AI anything...
              </Text>
            </View>
            <View className="w-10 h-10 bg-[#F4B400] rounded-full items-center justify-center">
              <Globe size={20} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50">
            {/* Modal Content */}
            <View className="flex-1 justify-end">
              <View className="bg-white rounded-t-3xl p-6 pb-8 shadow-2xl shadow-black/30">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-2xl font-bold text-gray-800">
                    AI Assistant
                  </Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                  >
                    <Text className="text-gray-600 text-lg font-bold">×</Text>
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search the web..."
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-800 text-base"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Action Buttons */}
                <View className="flex-row items-center justify-between">
                  {/* Attachment Button */}
                  <TouchableOpacity
                    className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Paperclip size={20} color="#6B7280" />
                  </TouchableOpacity>

                  {/* Search Button */}
                  <TouchableOpacity
                    className="flex-1 bg-[#F4B400] rounded-2xl py-4 px-6 mx-4 flex-row items-center justify-center"
                    activeOpacity={0.8}
                    onPress={handleSearch}
                  >
                    <Globe size={20} color="white" className="mr-2" />
                    <Text className="text-white font-semibold text-base ml-2">
                      Search
                    </Text>
                  </TouchableOpacity>

                  {/* Send Button */}
                  <TouchableOpacity
                    className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center"
                    activeOpacity={0.7}
                    onPress={handleSend}
                  >
                    <Send size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Additional Features */}
                <View className="mt-6 pt-6 border-t border-gray-100">
                  <Text className="text-gray-600 text-sm text-center mb-3">
                    Quick Actions
                  </Text>
                  <View className="flex-row justify-center space-x-4">
                    <TouchableOpacity className="bg-blue-50 rounded-xl px-4 py-2">
                      <Text className="text-blue-600 text-sm font-medium">Health Tips</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-green-50 rounded-xl px-4 py-2">
                      <Text className="text-green-600 text-sm font-medium">Diet Advice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-purple-50 rounded-xl px-4 py-2">
                      <Text className="text-purple-600 text-sm font-medium">Wellness</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
