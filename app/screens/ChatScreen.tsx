import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { GiftedChat } from '../components/chat/GiftedChat'
import { useStores } from "../models"
import coreSync from "../models/helpers/coreSync"
import { useFocusEffect, useNavigation } from "@react-navigation/native"



export const ChatScreen: FC<StackScreenProps<ChatScreenProps<"ChatList">>> = observer(function ChatScreen() {
  // Pull in one of our MST stores
  const { chatStore: {selected,sortedMessages, send, loadMessages, hasEarlierMessages} , identityStore } = useStores()
  const rootStore = useStores()
  const navigation = useNavigation()
  useFocusEffect(()=>{
    if(selected == null){
      navigation.navigate("ChatList");
    } else {
      loadMessages()
      const sub = coreSync(rootStore.chatStore)
      return ()=>sub.remove()
    }
  });
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