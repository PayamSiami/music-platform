import { screenPadding } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default class ndex extends Component {
  render() {
    return (
      <View style={defaultStyles.container}>
        <ScrollView
          style={{ paddingHorizontal: screenPadding.horizontal }}
          contentInsetAdjustmentBehavior="automatic"
        ></ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  artistItemContainer: {
    flexDirection: 'row',
    columnGap: 14,
    alignItems: 'center',
  },
  artistImage: {
    borderRadius: 32,
    width: 40,
    height: 40,
  },
  artistNameText: {
    ...defaultStyles.text,
    fontSize: 17,
    maxWidth: '80%',
  },
})
