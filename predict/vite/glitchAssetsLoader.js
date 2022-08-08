import { readFileSync } from 'fs'

const glitchAssetsFilePath = `./.glitch-assets`
export const glitchAssetsLoader = () => {
  return {
    name: 'glitch-assets-loader',
    config() {
      console.log("Loading glitch asset map...")
      const glitchAssetsFile = `${readFileSync(glitchAssetsFilePath)}` || ''
      const glitchAssetsList = glitchAssetsFile
        .trim()
        .split('\n')
        .map(n => JSON.parse(n))
      const deletedAssets = new Set(glitchAssetsList.filter(n => n.deleted).map(n => n.uuid))
      const glitchAssetsMap =
	    glitchAssetsList
          .reduce((acc, item) => {
            if (item.name && !deletedAssets.has(item.uuid)) {
              acc[item.name] = item        
            }
            return acc
          }, {})
      
      return {
        define: {
          'import.meta.env.VITE_GLITCH_ASSETS_MAP': `'${JSON.stringify(glitchAssetsMap)}'`
        }
      }
    },
  }
}
