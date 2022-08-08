export const glitchProjectName = window.location.host.replace(".glitch.me", "")
export const glitchRemixUrl = `https://glitch.com/edit/#!/remix/${glitchProjectName}`
export const glitchEditUrl = `https://glitch.com/edit/#!/${glitchProjectName}`
export const getGlitchEditUrlForFile = (file) => `${glitchEditUrl}?path=${encodeURIComponent(file)}`