export function createParticle(x, y, text, theme) {
	const particle = document.createElement('particle')
	document.body.appendChild(particle)
	let width = Math.floor(Math.random() * 30 + 8)
	let height = width
	let destinationX = (Math.random() - 0.5) * 300
	let destinationY = (Math.random() - 0.5) * 300
	let delay = Math.random() * 1

	particle.innerHTML = text
	particle.style.color = theme === 0 ? '#FF3F3F' : '#56B6FF' // Цвет символов
	particle.style.fontSize = `35px` // Размер символов
	particle.
	width = height = 'auto'

	particle.style.width = `${width}px`
	particle.style.height = `${height}px`
	const animation = particle.animate(
		[
			{
				transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
				opacity: 1,
			},
			{
				transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${
					y + destinationY
				}px)`,
				opacity: 0,
			},
		],
		{
			duration: 3000, // Продолжительность всех эффектов
			easing: 'cubic-bezier(0, .9, .57, 1)',
			delay: delay,
		}
	)
	animation.onfinish = removeParticle
}
function removeParticle(e) {
	e.srcElement.effect.target.remove()
}