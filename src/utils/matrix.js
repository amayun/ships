export default {
	rotateRight,
	plus,
	minus,
	flatten,
	clone,
	forEach,
	flatMap
}

export function rotateRight(matrix) {
	return matrix.reduceRight((acc, row) => {
		row.forEach((dot, dotIndex) => {
			if (!Array.isArray(acc[dotIndex])) {
				acc[dotIndex] = [];
			}

			acc[dotIndex].push(dot);
		});

		return acc;
	}, [])
}

export function plus(matrixA, matrixB, fromX, fromY) {
	return dotToDotVisitor(matrixA, matrixB, fromX, fromY, (a, b) => a + b);
}

export function minus(matrixA, matrixB, fromX, fromY) {
	return dotToDotVisitor(matrixA, matrixB, fromX, fromY, (a, b) => a - b);
}

export function flatten(matrixA) {
	return matrixA.reduce((acc, row) => acc.concat(row), [])
}

export function clone(matrix) {
	return matrix.reduce((acc, row, rowIndex) => {
		acc[rowIndex] = [...row];
		return acc;
	}, [])
}

export function forEach(matrix, iteratee) {
	const result = clone(matrix);

	dotVisitor(matrix, (dot, dotIndex, rowIndex) => {
		result[rowIndex][dotIndex] = iteratee(dot, dotIndex, rowIndex)
	});

	return result;
}

export function flatMap(matrix, iteratee) {
	const result = [];

	dotVisitor(matrix, (dot, dotIndex, rowIndex) => {
		result.push(iteratee(dot, dotIndex, rowIndex))
	});

	return result;
}

function dotToDotVisitor(matrixA, matrixB, fromX = 0, fromY = 0, iteratee) {
	const result = clone(matrixA);

	dotVisitor(matrixB, (dot, dotIndex, rowIndex) => {
		let x = fromX + dotIndex;
		let y = fromY + rowIndex;
		if (matrixA[y] && matrixA[y][x] !== undefined) {
			result[y][x] = iteratee(matrixA[y][x], dot);
		}
	});

	return result;
}

function dotVisitor(matrix, visitor) {
	matrix.forEach((row, rowIndex) => {
		row.forEach((dot, dotIndex) => {
			visitor(dot, dotIndex, rowIndex);
		})
	});
}