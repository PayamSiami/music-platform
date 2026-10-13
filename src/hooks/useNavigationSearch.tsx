import { colors } from '@/constants/tokens'
import { useNavigation } from 'expo-router'
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { SearchBarProps } from 'react-native-screens'

const defaultSearchOptions: SearchBarProps = {
  tintColor: colors.primary,
  hideWhenScrolling: false,
}

export const useNavigationSearch = ({
  searchBarOptions,
}: {
  searchBarOptions?: SearchBarProps
}) => {
  const [search, setSearch] = useState('')
  const navigation = useNavigation()

  const options = useMemo(
    () => ({
      ...defaultSearchOptions,
      ...searchBarOptions,
    }),
    [searchBarOptions],
  )

  const handleOnChangeText = useCallback<
    NonNullable<SearchBarProps['onChangeText']>
  >(({ nativeEvent: { text } }) => {
    setSearch(text)
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        ...options,
        onChangeText: handleOnChangeText,
      },
    })
  }, [navigation, options, handleOnChangeText])

  return search
}