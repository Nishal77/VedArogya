import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, MoreHorizontal } from 'lucide-react-native';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
  pubDate: string;
  source_name: string;
  category: string[];
  country: string[];
}

const News: React.FC = () => {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY_1 = process.env.NEWSDATA_API_KEY_1 || 'pub_da804cef83e64e2ba4b04416fbeb518b';
  const API_KEY_2 = process.env.NEWSDATA_API_KEY_2 || '2adbfba32de045a1a90cff62fe16031c';
  
  const API_URL_1 = `https://newsdata.io/api/1/latest?apikey=${API_KEY_1}&q=ayurveda`;
  const API_URL_2 = `https://newsdata.io/api/1/latest?apikey=${API_KEY_2}&q=ayurveda`;

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [response1, response2] = await Promise.all([
        fetch(API_URL_1),
        fetch(API_URL_2)
      ]);
      
      const data1 = await response1.json();
      const data2 = await response2.json();
      
      let allNews: NewsArticle[] = [];
      
      if (data1.status === 'success' && data1.results) {
        allNews = [...allNews, ...data1.results];
      }
      
      if (data2.status === 'success' && data2.results) {
        allNews = [...allNews, ...data2.results];
      }
      
      const uniqueNews = allNews.filter((article, index, self) => 
        index === self.findIndex(a => 
          a.article_id === article.article_id || 
          a.title === article.title
        )
      );
      
      uniqueNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      setNews(uniqueNews);
      
      if (uniqueNews.length === 0) {
        setError('No Ayurveda news available from either API');
      }
      
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const handleBack = () => {
    router.back();
  };

  const openNewsLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="mt-4 text-gray-600 text-center">
            Loading Ayurveda news...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity className="p-2" onPress={handleBack}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Ayurveda News</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View className="p-6 items-center">
            <Text className="text-red-500 text-center mb-4">{error}</Text>
            <TouchableOpacity
              onPress={fetchNews}
              className="bg-green-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="p-4">
            {news.map((article, index) => (
              <TouchableOpacity
                key={article.article_id || index}
                onPress={() => openNewsLink(article.link)}
                className="bg-gray-50 rounded-xl mb-4 overflow-hidden border border-gray-100 shadow-sm"
                activeOpacity={0.8}
              >
                {article.image_url && (
                  <Image
                    source={{ uri: article.image_url }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                )}

                <View className="p-4">
                  <Text className="text-lg font-bold text-gray-800 mb-3 leading-6">
                    {article.title}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-3">
                      <View className="bg-red-500 rounded-full w-3 h-3" />
                      <Text className="text-gray-600 text-sm">
                        {article.source_name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {formatDate(article.pubDate)}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                      <TouchableOpacity className="p-2">
                        <Heart size={18} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity className="p-2">
                        <MoreHorizontal size={18} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {news.length === 0 && !loading && (
              <View className="p-6 items-center">
                <Text className="text-gray-500 text-center text-lg">
                  No Ayurveda news available at the moment.
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Pull down to refresh or try again later.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default News;
