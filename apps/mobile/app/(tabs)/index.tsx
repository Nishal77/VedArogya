import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { View } from 'react-native'

export default function TabsIndex() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Ensure component is mounted before navigating
    setIsMounted(true)

    // Use setTimeout to ensure navigation happens after render
    const timer = setTimeout(() => {
      // Redirect to default user_id structure
      // TODO: Replace with actual user_id from auth context or storage
      router.replace('/(tabs)/user123/(tabs)')
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Return a minimal view while mounting
  return <View style={{ flex: 1 }} />
}
