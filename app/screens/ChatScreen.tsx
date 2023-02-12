import React, { FC, useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { GiftedChat } from '../components/chat/GiftedChat'
import { useStores } from "../models"
import coreSync from "../models/helpers/coreSync"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import {MessageStatusFilter, NewMessageFilter} from "../services/core/real/const"



export const ChatScreen: FC<StackScreenProps<ChatScreenProps<"ChatList">>> = observer(function ChatScreen() {
  // Pull in one of our MST stores
  const { messageStore: { onFocus, chatId }} = useStores()
  const rootStore = useStores()
  const navigation = useNavigation()
  useFocusEffect(()=>{
    if(chatId){
      onFocus()
      console.log("onFocus")
      const sub = coreSync(rootStore.messageStore,"onMessageChange", MessageStatusFilter)
      const sub2 = coreSync(rootStore.messageStore,"onNewMessage", NewMessageFilter)
      return () => {sub.remove();sub2.remove()}
    } else {
      navigation.navigate("ChatList")
    }
  })

  return (
    <Chat></Chat>
  )
})

export const Chat = observer(function Chat() {
  const { messageStore: { send, load, hasEarlierMessages, sortedMessages }, identityStore } = useStores()
  return (
    <GiftedChat
      messages={
        sortedMessages
      }
      onSend={messages => {
        messages.map(msg => send(msg))
      }}
      user={identityStore.user}
      loadEarlier={hasEarlierMessages}
      onLoadEarlier={load}
      infiniteScroll={true}
    />
  )
})