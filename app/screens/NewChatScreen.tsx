import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { FAB } from 'react-native-paper';
import { List } from 'react-native-paper';


export const NewChatScreen: FC<StackScreenProps<ChatScreenProps<"NewChat">>> = observer(function NewChatScreen() {
  // Pull in one of our MST stores
  const { chatStore: { openPMChat }, contactStore: { list, load, form: { done, _id, reset } } } = useStores()
  useEffect(() => {
    load()
  }, [])
  useEffect(() => {
    if (!!done) {
      console.log("done caled")
      openPMChat(_id).then(() => {
        navigation.navigate("Chat")
        reset()
      }).catch((e) => {
        console.log("open failed",e)
      })
    }
  }, [done])
  const navigation = useNavigation()
  const navigateItem = (id) => {
    return () => {
      openPMChat(id).then(() => {
        navigation.navigate("Chat")
      }).catch((e) => {
        console.log("open failed",e)
      })
    }
  }

  const newContact = () => {
    navigation.navigate("NewContact")
  }

  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      onPress={navigateItem(item._id)} />
  )

  return (
    <>

      <List.Section>
        <List.Item
          style={$listItem}
          title="New Group"
          left={() => <List.Icon icon="account-multiple" />}
          onPress={()=>{navigation.navigate("NewGroupMembers")}}
        />
        <List.Subheader>contacts</List.Subheader>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      </List.Section>



      <View style={$fixedView}>
        <FAB
          icon="account-plus"
          style={$fab}
          onPress={newContact}
        />
      </View>
    </>
  )
})


const $fab: ViewStyle = {
  margin: 40,
  right: 0,
  bottom: 0,
}
const $listItem: ViewStyle = {
  paddingVertical: 3,
  paddingHorizontal: 10,
}

const $fixedView: ViewStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
}