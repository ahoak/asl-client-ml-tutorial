import { useMemo } from 'react'

/**
 * Creates a MediaStream for the given track
 * @param track The track to create a stream for
 */
export function getStreamForTrack(track) {
  if (track) {
    if (track instanceof MediaStreamTrack) {
      const stream = new MediaStream()
      stream.addTrack(track)
      return stream
    }
    return track
  }
  return null
}