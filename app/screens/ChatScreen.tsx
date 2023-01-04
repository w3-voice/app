import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { GiftedChat } from '../components/chat/GiftedChat'
import { useStores } from "../models"


export const ChatScreen: FC<StackScreenProps<ChatScreenProps<"ChatList">>> = observer(function ChatScreen() {
  // Pull in one of our MST stores
  const { chatStore: {sortedMessages, send, loadMessages, hasEarlierMessages} , identityStore } = useStores()
  useEffect(()=>{
    loadMessages()
  },[])
  return (
    <GiftedChat
      messages={
        sortedMessages
      }
      onSend={messages => {
        messages.map(msg=>send(msg))
      }}
      user={identityStore.user}
      loadEarlier={hasEarlierMessages}
      onLoadEarlier={loadMessages}
      infiniteScroll={true}
    />
  )
})