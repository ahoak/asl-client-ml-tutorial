/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function fastDebounce(callback, delay = 100) {
	let lastUpdate
	let startLoop = true
	let lastArgs = null

	function loop() {
		const timeSinceLastUpdate = Date.now() - lastUpdate
		if (timeSinceLastUpdate < delay) {
			// Set timeout for the remaining time
			setTimeout(loop, delay - timeSinceLastUpdate)
		} else {
			startLoop = true
			if (lastArgs != null && lastArgs.length > 0) {
				callback.apply(null, Array.prototype.slice.call(lastArgs))
			} else {
				callback()
			}
		}
	}

	return function () {
		lastArgs = arguments
		lastUpdate = Date.now()
		if (startLoop) {
			startLoop = false
			loop()
		}
	}
}