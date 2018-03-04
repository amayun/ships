export function times(fn, times = 1) {
	return Array(times).fill(null).map((item, index) => fn(index))
}

export function rand(from, to) {
	return from + Math.round((to - from) * Math.random());
}

export function curry(fn, ...args) {
	return (...nArgs) => fn.apply(this, [...args, ...nArgs]);
}