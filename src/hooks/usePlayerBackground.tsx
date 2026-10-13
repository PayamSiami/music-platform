import { colors } from '@/constants/tokens'
import { getColors, type ImageColorsResult } from 'react-native-image-colors'
import { useEffect, useState } from 'react'

type PlayerBackground = readonly [string, string]

const FALLBACK_BACKGROUND: PlayerBackground = [colors.background, colors.background]

const DARKEN_AMOUNT = 0.55

const darkenColor = (hexColor: string, amount: number) => {
	const normalizedColor = hexColor.replace('#', '')
	const isShortHex = normalizedColor.length === 3
	const channelSize = isShortHex ? 1 : 2

	const parseChannel = (channel: string) =>
		parseInt(isShortHex ? channel + channel : channel, 16)

	const red = parseChannel(normalizedColor.slice(0, channelSize))
	const green = parseChannel(
		normalizedColor.slice(channelSize, channelSize * 2),
	)
	const blue = parseChannel(
		normalizedColor.slice(channelSize * 2, channelSize * 3),
	)

	const darkenChannel = (channel: number) =>
		Math.max(0, Math.min(255, Math.round(channel * (1 - amount))))

	return `#${[red, green, blue]
		.map((channel) => darkenChannel(channel).toString(16).padStart(2, '0'))
		.join('')}`
}

const extractAccentColor = (result: ImageColorsResult) => {
	switch (result.platform) {
		case 'ios':
			return result.background
		case 'android':
			return result.average
		default:
			return result.dominant
	}
}

/**
 * Derives a background gradient from the artwork's prominent colors so the
 * player screen is tinted by whatever is playing. Falls back to the plain
 * background color when no artwork is available or color extraction fails.
 */
export const usePlayerBackground = (artworkUri?: string): PlayerBackground => {
	const [background, setBackground] = useState<PlayerBackground>(FALLBACK_BACKGROUND)

	useEffect(() => {
		let isCancelled = false

		const loadBackground = async (): Promise<PlayerBackground> => {
			if (!artworkUri) return FALLBACK_BACKGROUND

			try {
				const result = await getColors(artworkUri, {
					fallback: colors.background,
					cache: true,
				})

				const accentColor = darkenColor(extractAccentColor(result), DARKEN_AMOUNT)

				return [accentColor, colors.background]
			} catch {
				return FALLBACK_BACKGROUND
			}
		}

		loadBackground().then((nextBackground) => {
			if (!isCancelled) {
				setBackground(nextBackground)
			}
		})

		return () => {
			isCancelled = true
		}
	}, [artworkUri])

	return background
}
