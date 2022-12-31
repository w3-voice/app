import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { Modal, Portal } from "react-native-paper"
import { Text, ViewStyle } from "react-native"
import QRCode from 'react-native-qrcode-svg';
import { useStores } from "../models"
import { useNavigation } from "@react-navigation/native"


export const QRCodeModalScreen: FC<StackScreenProps<ChatScreenProps<"QRCodeModal">>> = observer(function QRCodeModalScreen() {
    // Pull in one of our MST stores
    const { identity } = useStores()
    const [visibility, setVisibility] = useState(true)
    const navigation = useNavigation()
    const dismiss = ()=>{
        setVisibility(false)
        navigation.goBack()
    }
    return (
        <Portal>
            <Modal visible={visibility} onDismiss={dismiss} contentContainerStyle={$containerStyle}>
                <QRCode
                    value={`/p2p/${identity.user._id}/@${identity.user.name}`}
                    size={250}
                />
            </Modal>
        </Portal>
    )
})

const $containerStyle: ViewStyle = {
    backgroundColor: 'white',
    padding: 50,
    display: "flex",
    justifyContent: "center",
    flexDirection: 'row'
    
}
