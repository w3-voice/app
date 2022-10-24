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

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Chat: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Chat" component={ChatScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ChatScreen: FC<StackScreenProps<AppStackScreenProps, "ChatNavigator">> = observer(function ChatScreen() {
  // Pull in one of our MST stores
  const { messageStore: { messages, send }, identity } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const route = useRoute()
  const { chatId } = route.params
  // load(chatId)

  return (
    messages.length > 0 &&
    <GiftedChat
      messages={messages.slice()}
      onSend={messages => {
        messages.map(msg=>send(chatId, msg))
      }}
      user={{
        _id: identity.id,
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