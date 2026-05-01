import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signUp = () => {
  return (
    <View>
      <Text>signUp</Text>
      <Link href={"/(auth)/signIn"}>Log In</Link>
    </View>
  )
}

export default signUp