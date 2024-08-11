let endTime = Date.now() + 8000
let i = 0
function updateTimer() {
	console.log(i)
	i++
	

	let remaining = endTime - Date.now()
	if (remaining <= 0) {
		console.log(i);
		
		return
	}
	setTimeout(updateTimer, remaining % 1000 || 1000)
}

updateTimer()
