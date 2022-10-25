import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text } from "../components"
import { useRoute } from "@react-navigation/native"
import { spacing } from "../theme"
import { GiftedChat } from 'react-native-gifted-chat'
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"


export const ChatScreen: FC<StackScreenProps<AppStackScreenProps, "ChatNavigator">> = observer(function ChatScreen() {
  // Pull in one of our MST stores
  const { chatStore: { messages, send }, identity } = useStores()

  return (
    
    <GiftedChat
      messages={messages.slice()}
      onSend={messages => {
        messages.map(msg=>send(msg))
      }}
      user={{
        _id: identity._id,
        name: identity.name
      }}
    />
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}