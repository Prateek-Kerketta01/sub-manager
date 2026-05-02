import { posthog } from '@/src/config/posthog'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class onboarding extends Component {
  componentDidMount() {
    posthog.capture('onboarding_viewed')
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}
