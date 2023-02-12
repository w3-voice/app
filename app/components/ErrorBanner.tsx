import * as React from 'react';
import { Image } from 'react-native';
import { Banner } from 'react-native-paper';

export interface ErrorBannerProps {
    message: string,
    visible: boolean,
    done: ()=> void,
}

export const ErrorBanner = ({message, visible, done}:ErrorBannerProps) => {
  return (
    <Banner
      visible={visible}
      actions={[
        {
            label: 'Ok',
            onPress: () => done(),
          },
      ]}
      icon={({size}) => (
        <Image
          source={{
            uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4',
          }}
          style={{
            width: size,
            height: size,
          }}
        />
      )}>
      {message}
    </Banner>
  );
};