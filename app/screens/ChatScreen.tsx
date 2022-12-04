import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { GiftedChat } from '../components/chat/GiftedChat'
import { useStores } from "../models"


export const ChatScreen: FC<StackScreenProps<AppStackScreenProps, "ChatNavigator">> = observer(function ChatScreen() {
  // Pull in one of our MST stores
  const { chatStore: {sortedMessages, send} , identity } = useStores()

  return (
    <GiftedChat
      messages={
        sortedMessages
      }
      onSend={messages => {
        messages.map(msg=>send(msg))
      }}
      user={identity.user}
    />
  )
})