import React, { FC, useCallback } from "react"
import { Observer, observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../../navigators"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { useFocusEffect } from "@react-navigation/native"
import { FAB, List } from "react-native-paper"
import { FlashList } from "@shopify/flash-list";


export const NewGroupMembersScreen: FC<StackScreenProps<ChatScreenProps<"NewGroupMembers">>> = observer(function NewGroupMembersScreen() {
  // Pull in one of our MST stores
  const { contactStore: { list, load }, newGroup: { selected, onSelectChange } } = useStores()
  // Pull in navigation via hook
  const navigation = useNavigation()

  useFocusEffect(useCallback(() => {
    load()
  }, []))

  const changeSelect = (item) => {
    onSelectChange(item)
    item.onChangeSelect()
  }

  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      left={props =>
        <Observer>
          {() =>
            item.selected && <List.Icon {...props} icon="check" />}</Observer>
      }
      onPress={() => { changeSelect(item) }} />
  )

  return (
    <>
      <FlashList
        data={list}
        renderItem={renderItem}
        estimatedItemSize={200}
      />
      {
        selected.size > 0 && <View style={$fixedView}>
          <FAB
            icon="arrow-right-thick"
            style={$fab}
            onPress={() => { navigation.navigate("NewGroupName") }}
          />
        </View>
      }

    </>




  )
})

const $fixedView: ViewStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
}
const $fab: ViewStyle = {
  margin: 40,
  right: 0,
  bottom: 0,
}