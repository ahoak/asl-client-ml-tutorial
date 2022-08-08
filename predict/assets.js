const mapJSON = import.meta.env.VITE_GLITCH_ASSETS_MAP
if (!mapJSON) {
  throw new Error("Could not find the VITE_GLITCH_ASSETS_MAP environment variable")
}

/**
 * This is a map between file name, and url for the assets in the assets folder
 */
const parsedAssetsMap = JSON.parse(mapJSON)

/**
 * The list of available assets
 */
export const names = Object.keys(parsedAssetsMap)

/**
 * Reads data for the given asset
 */
export async function readAssetData(name) {
  const assetMeta = parsedAssetsMap[name]
  if (assetMeta) {
    const { url } = assetMeta
    const resp = await fetch(url)
    if (resp.ok) {
      return resp
    } else {
      console.error(resp)
      throw new Error(`Unknown Error Loading Asset ${name}`)
    }
  } else {
    throw new Error(`Unknown asset: ${name}`)
  }
}

/**
 * Reads the url for the given asset
 */
export async function getAssetUrl(name) {
  const assetMeta = parsedAssetsMap[name]
  if (assetMeta) {
    const { url } = assetMeta
    return url
  } else {
    throw new Error(`Unknown asset: ${name}`)
  }
}