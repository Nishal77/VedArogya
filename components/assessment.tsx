import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { Wind, Flame, Leaf } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DoshaAnswers {
  bodyType: string;
  skinType: string;
  appetite: string;
  energy: string;
  sleep: string;
  mood: string;
  climate: string;
  stressResponse: string;
  digestion: string;
  bodyTemperature: string;
}

interface AssessmentProps {
  doshaAnswers: DoshaAnswers;
  onAnswerChange: (question: string, answer: string) => void;
}

interface Question {
  key: keyof DoshaAnswers;
  question: string;
  options: string[];
  vataScore: number[];
  pittaScore: number[];
  kaphaScore: number[];
}

const questions: Question[] = [
  {
    key: 'bodyType',
    question: 'What best describes your body type?',
    options: ['Slim & light', 'Medium & muscular', 'Broad & solid'],
    vataScore: [3, 1, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'skinType',
    question: 'How is your skin usually?',
    options: ['Dry & rough', 'Warm & sensitive', 'Oily & smooth'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'appetite',
    question: 'How is your hunger?',
    options: ['Irregular or small', 'Strong & sharp', 'Steady but slow'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'energy',
    question: 'Your energy levels are mostly…',
    options: ['Variable, comes in bursts', 'Intense & driven', 'Stable but slow'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'sleep',
    question: 'How do you sleep?',
    options: ['Light & easily disturbed', 'Moderate, sometimes restless', 'Deep & heavy'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'mood',
    question: 'Your usual mood is…',
    options: ['Anxious or restless', 'Irritable or intense', 'Calm or lazy'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'climate',
    question: 'Which climate feels best for you?',
    options: ['Warm & humid', 'Cool & fresh', 'Dry & warm'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'stressResponse',
    question: 'Under stress, you usually…',
    options: ['Worry & overthink', 'Get angry or frustrated', 'Withdraw or comfort eat'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'digestion',
    question: 'How is your digestion?',
    options: ['Irregular, bloating', 'Strong, fast', 'Slow, heavy'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  },
  {
    key: 'bodyTemperature',
    question: 'How is your body temperature?',
    options: ['Often cold', 'Often warm', 'Often cool & steady'],
    vataScore: [3, 0, 0],
    pittaScore: [0, 3, 1],
    kaphaScore: [0, 1, 3]
  }
];

export default function DoshaAssessment({ doshaAnswers, onAnswerChange }: AssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const calculateDosha = () => {
    let vataTotal = 0;
    let pittaTotal = 0;
    let kaphaTotal = 0;

    // Step 1: Count answers for each dosha (1 point per answer)
    questions.forEach((question) => {
      const answer = doshaAnswers[question.key];
      if (answer !== '') {
        const optionIndex = question.options.indexOf(answer);
        if (optionIndex === 0) vataTotal += 1;      // First option = Vata
        else if (optionIndex === 1) pittaTotal += 1; // Second option = Pitta
        else if (optionIndex === 2) kaphaTotal += 1; // Third option = Kapha
      }
    });

    // Step 2: Calculate percentages
    const total = vataTotal + pittaTotal + kaphaTotal;
    const vataPercentage = total > 0 ? Math.round((vataTotal / total) * 100) : 0;
    const pittaPercentage = total > 0 ? Math.round((pittaTotal / total) * 100) : 0;
    const kaphaPercentage = total > 0 ? Math.round((kaphaTotal / total) * 100) : 0;

    // Step 3: Determine dominant dosha(s)
    const scores = [
      { type: 'Vata', score: vataTotal, percentage: vataPercentage, color: '#8DB600' },
      { type: 'Pitta', score: pittaTotal, percentage: pittaPercentage, color: '#F4B400' },
      { type: 'Kapha', score: kaphaTotal, percentage: kaphaPercentage, color: '#6B7280' }
    ].sort((a, b) => b.score - a.score);

    // Check for ties
    const highestScore = scores[0].score;
    const tiedDoshas = scores.filter(dosha => dosha.score === highestScore);
    
    let dominantType = '';
    let isDualDosha = false;
    
    if (tiedDoshas.length > 1) {
      // Dual dosha case
      isDualDosha = true;
      dominantType = tiedDoshas.map(d => d.type).join('-');
    } else {
      // Single dominant dosha
      dominantType = scores[0].type;
    }

    return {
      primary: scores[0],
      secondary: scores[1],
      tertiary: scores[2],
      percentages: { vata: vataPercentage, pitta: pittaPercentage, kapha: kaphaPercentage },
      dominantType,
      isDualDosha,
      rawScores: { vata: vataTotal, pitta: pittaTotal, kapha: kaphaTotal }
    };
  };

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion];
    onAnswerChange(question.key, answer);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const getDoshaDescription = (doshaType: string) => {
    const descriptions = {
      Vata: 'Creative, quick-thinking, and adaptable. You may experience variable energy and need routine.',
      Pitta: 'Intelligent, focused, and driven. You have strong digestion and may be prone to intensity.',
      Kapha: 'Strong, loyal, and patient. You have stable energy and may need motivation to stay active.'
    };
    return descriptions[doshaType as keyof typeof descriptions] || '';
  };

  const getWellnessTips = (doshaType: string) => {
    const tips = {
      Vata: '• Establish regular routines\n• Practice gentle yoga\n• Use warm, grounding foods\n• Get adequate rest',
      Pitta: '• Stay cool and hydrated\n• Practice cooling breathwork\n• Avoid spicy, hot foods\n• Take time to relax',
      Kapha: '• Stay active and energized\n• Use stimulating spices\n• Light, dry foods work best\n• Morning exercise is ideal'
    };
    return tips[doshaType as keyof typeof tips] || '';
  };

  const getDualDoshaTips = (doshaType: string) => {
    const tips: { [key: string]: string } = {
      'Vata-Pitta': 'You have a mix of Vata and Pitta traits. Focus on grounding and calming activities. Try gentle yoga, meditation, and cooling foods.',
      'Vata-Kapha': 'You have a mix of Vata and Kapha traits. Balance your energy with movement and grounding practices. Consider gentle exercise and warm, grounding foods.',
      'Pitta-Kapha': 'You have a mix of Pitta and Kapha traits. Balance your energy with cooling and stimulating activities. Try cooling breathwork, light exercise, and stimulating spices.',
      'Vata-Pitta-Kapha': 'You have a mix of all three doshas. This is a unique constitution. Focus on finding balance in all aspects of your life. Consider a variety of practices and foods.'
    };
    return tips[doshaType] || 'No specific dual dosha tips available for this combination.';
  };

  const getDualDoshaDescription = (doshaType: string) => {
    const descriptions: { [key: string]: string } = {
      'Vata-Pitta': 'You have a mix of Vata and Pitta traits. This dual dosha combination can lead to a unique constitution. You may experience a blend of Vata\'s adaptable and Pitta\'s focused traits.',
      'Vata-Kapha': 'You have a mix of Vata and Kapha traits. This dual dosha combination can result in a strong, loyal, and patient individual. You may struggle with Vata\'s variable energy and Kapha\'s stable energy.',
      'Pitta-Kapha': 'You have a mix of Pitta and Kapha traits. This dual dosha combination can create a unique constitution. You may experience a blend of Pitta\'s intense and Kapha\'s stable traits.',
      'Vata-Pitta-Kapha': 'You have a mix of all three doshas. This is a unique constitution. You may experience a blend of Vata\'s adaptable, Pitta\'s focused, and Kapha\'s stable traits.'
    };
    return descriptions[doshaType] || '';
  };

  if (showResults) {
    const doshaResult = calculateDosha();
    
    return (
      <View className="flex-1">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-3">Your Dosha Results</Text>
          <Text className="text-lg text-gray-600 leading-6">Discover your unique constitution</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Primary Dosha Result */}
          <View className="bg-white p-8 rounded-3xl border border-gray-100 mb-6">
            <View className="items-center">
              <View className={`w-20 h-20 bg-white rounded-full items-center justify-center mb-4 border-2 ${
                doshaResult.dominantType === 'Vata' ? 'border-[#81D4FA]' : 
                doshaResult.dominantType === 'Pitta' ? 'border-[#FF8C42]' : 
                'border-[#4CAF50]'
              }`}>
                {doshaResult.dominantType === 'Vata' ? (
                  <Wind color="#81D4FA" size={32} />
                ) : doshaResult.dominantType === 'Pitta' ? (
                  <Flame color="#FF8C42" size={32} />
                ) : (
                  <Leaf color="#4CAF50" size={32} />
                )}
              </View>
              <Text className="text-center text-3xl font-bold text-gray-800 mb-2">
                Dosha {doshaResult.dominantType}
              </Text>
              {doshaResult.isDualDosha && (
                <Text className="text-gray-600 text-center text-lg mb-4">
                  You have mixed traits of both
                </Text>
              )}
              <Text className="text-gray-700 text-center leading-7 text-lg">
                {doshaResult.isDualDosha ? 
                  getDualDoshaDescription(doshaResult.dominantType) : 
                  getDoshaDescription(doshaResult.dominantType)
                }
              </Text>
            </View>
          </View>

          {/* Dosha Score Summary */}
          <View className="bg-white p-6 rounded-3xl border border-gray-100 mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Your Dosha Scores</Text>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-700 font-bold text-lg">Vata</Text>
              <Text className="text-gray-600 font-semibold text-lg">{doshaResult.rawScores.vata}/10</Text>
            </View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-700 font-bold text-lg">Pitta</Text>
              <Text className="text-gray-600 font-semibold text-lg">{doshaResult.rawScores.pitta}/10</Text>
            </View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-700 font-bold text-lg">Kapha</Text>
              <Text className="text-gray-600 font-semibold text-lg">{doshaResult.rawScores.kapha}/10</Text>
            </View>
          </View>

          {/* Dosha Breakdown */}
          <View className="bg-white p-8 rounded-3xl border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Dosha Balance</Text>
            
            {/* Circular Dosha Icons */}
            <View className="flex-row items-center justify-center mb-6">
              {/* Vata */}
              <View className="items-center mr-3">
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-3 border-2 border-[#81D4FA]">
                  <Wind color="#81D4FA" size={24} />
                </View>
                <Text className="text-gray-700 font-bold text-lg mb-1">Vata</Text>
                <Text className="text-[#81D4FA] font-bold text-xl">{doshaResult.percentages.vata}%</Text>
              </View>

              {/* Pitta */}
              <View className="items-center mr-3">
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-3 border-2 border-[#FF8C42]">
                  <Flame color="#FF8C42" size={24} />
                </View>
                <Text className="text-gray-700 font-bold text-lg mb-1">Pitta</Text>
                <Text className="text-[#FF8C42] font-bold text-xl">{doshaResult.percentages.pitta}%</Text>
              </View>

              {/* Kapha */}
              <View className="items-center">
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-3 border-2 border-[#4CAF50]">
                  <Leaf color="#4CAF50" size={24} />
                </View>
                <Text className="text-gray-700 font-bold text-lg mb-1">Kapha</Text>
                <Text className="text-[#4CAF50] font-bold text-xl">{doshaResult.percentages.kapha}%</Text>
              </View>
            </View>

            {/* Summary Line */}
            <View className="bg-gray-50 rounded-2xl p-4">
              <Text className="text-center text-gray-700 font-medium text-lg">
                <Text className="text-gray-600">Vata </Text>
                <Text className="text-[#81D4FA] font-bold">{doshaResult.percentages.vata}%</Text>
                <Text className="text-gray-400"> | </Text>
                <Text className="text-gray-600">Pitta </Text>
                <Text className="text-[#FF8C42] font-bold">{doshaResult.percentages.pitta}%</Text>
                <Text className="text-gray-400"> | </Text>
                <Text className="text-gray-600">Kapha </Text>
                <Text className="text-[#4CAF50] font-bold">{doshaResult.percentages.kapha}%</Text>
              </Text>
            </View>
          </View>

          {/* Wellness Tips */}
          <View className="bg-white p-8 rounded-3xl border border-gray-100 mb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 bg-[#8DB600] rounded-full items-center justify-center mr-4">
                <Text className="text-white text-xl">💡</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800">
                Wellness Tips for {doshaResult.dominantType}
              </Text>
            </View>
            <Text className="text-gray-700 leading-7 text-lg whitespace-pre-line">
              {doshaResult.isDualDosha ? 
                getDualDoshaTips(doshaResult.dominantType) : 
                getWellnessTips(doshaResult.dominantType)
              }
            </Text>
          </View>

          {/* Important Note */}
          <View className="bg-white p-8 rounded-3xl border border-gray-100 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-4">
                <Text className="text-white text-lg">💎</Text>
              </View>
              <Text className="text-xl font-bold text-blue-800">Remember</Text>
            </View>
            <Text className="text-blue-800 text-center leading-7 text-lg">
              Your dosha can shift throughout life. These results help us personalize your wellness journey, but they're just the beginning!
            </Text>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={resetAssessment}
            className="bg-gray-100 py-5 rounded-2xl items-center mb-6 border border-gray-200"
          >
            <Text className="text-gray-700 font-bold text-lg">🔄 Retake Assessment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const question = questions[currentQuestion];
  
  // Calculate progress based on actual answered questions, not just current question position
  const answeredQuestions = Object.values(doshaAnswers).filter(answer => answer !== '').length;
  const progress = (answeredQuestions / questions.length) * 100;

  // Debug progress calculation
  console.log(`Answered: ${answeredQuestions}/${questions.length}, Progress: ${progress}%`);

  return (
    <View className="flex-1">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-3">Step 3</Text>
        <Text className="text-lg text-black leading-6">Dosha Assessment</Text>
        <Text className="text-base mt-2">
          <Text className="text-black font-semibold">Vata</Text>
          <Text className="text-gray-500">, </Text>
          <Text className="text-black font-semibold">Pitta</Text>
          <Text className="text-gray-500">, or </Text>
          <Text className="text-black font-semibold">Kapha</Text>
          <Text className="text-gray-500"> guides your wellness. Keep your answers </Text>
          <Text className="text-black font-semibold">real</Text>
          <Text className="text-gray-500"> for the best guidance.</Text>
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-600 text-sm font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <Text className="text-gray-600 text-sm font-semibold">
            {answeredQuestions} of {questions.length} answered
          </Text>
        </View>
        
        {/* Perfect Progress Bar */}
        <View className="relative">
          {/* Background Track */}
          <View className="w-full bg-gray-100 rounded-full h-3 shadow-inner overflow-hidden border border-gray-200">
            {/* Progress Fill with #8DB600 */}
            <View 
              className="bg-[#8DB600] h-3 rounded-full shadow-sm" 
              style={{ 
                width: `${progress}%`,
                minWidth: progress > 0 ? 12 : 0
              }}
            />
          </View>
        </View>
      </View>

      {/* Question Card */}
      <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-gray-700 font-bold text-lg leading-6 flex-1">
            {question.question}
          </Text>
          
          {/* Clear Answer Icon */}
          {doshaAnswers[question.key] && (
            <TouchableOpacity
              onPress={() => onAnswerChange(question.key, '')}
              className="ml-4 px-3 py-2 bg-gray-100 rounded-full active:bg-gray-200"
            >
              <Text className="text-gray-600 text-sm font-medium">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={option}
              className={`py-4 px-5 rounded-2xl border-2 transition-all duration-200 ${
                doshaAnswers[question.key] === option 
                  ? 'border-[#8DB600] bg-[#8DB600]/10 shadow-lg shadow-[#8DB600]/20' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              } ${index !== question.options.length - 1 ? 'mb-3' : ''}`}
              onPress={() => handleAnswer(option)}
            >
              <Text className={`font-medium text-base text-center ${
                doshaAnswers[question.key] === option ? 'text-[#8DB600] font-semibold' : 'text-gray-600'
              }`}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
