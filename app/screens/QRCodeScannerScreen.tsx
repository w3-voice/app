import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { StyleSheet, Text, TextStyle } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { useNavigation } from "@react-navigation/native";
import { useStores } from "../models";


export const QRCodeScannerScreen: FC<StackScreenProps<ChatScreenProps<"QRCodeScanner">>> = observer(function QRCodeScanner() {
  // Pull in one of our MST stores
  const { chatStore: {newContact:{setId, setName}} } = useStores()
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  // Alternatively you can use the underlying function:
  //
  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
  //   runOnJS(setBarcodes)(detectedBarcodes);
  // }, []);

  const parseLink = (link: string)=>{
    const [id, name] = link.split('/p2p/')[1].split('/@',2)
    return {id, name}
  }

  const validateLink = (link: string) => {
    if(link.startsWith('/p2p/')){
      return true
    }
    return false
  }

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log(status)
      setHasPermission(status === 'authorized');
    })();
  }, []);

  useEffect(()=>{
    if(barcodes[0] && validateLink(barcodes[0].displayValue)){
      const {id, name} = parseLink(barcodes[0].displayValue)
      setName(name)
      setId(id)
      navigation.navigate("NewContact")
    }
  }, [barcodes])

  return (
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        {barcodes.map((barcode, idx) => (
          <Text key={idx} style={$barcodeTextURL}>
            {barcode.displayValue}
          </Text>
        ))}
      </>
    )
  )
})

const $barcodeTextURL: TextStyle = {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }