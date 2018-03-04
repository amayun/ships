export function rotateRight(matrix) {
	return matrix.reduceRight((acc, row) => {
		row.forEach((dot, dotIndex) => {
			if (!Array.isArray(rotated[dotIndex])) {
				rotated[dotIndex] = [];
			}

			rotated[dotIndex].push(dot);
		});

		return rotated;
	}, [])
}

export function plus(matrixA, matrixB, fromX, fromY) {
	return dotVisitor(matrixA, matrixB, fromX, fromY, (a, b) => a + b);
}

export function minus(matrixA, matrixB, fromX, fromY) {
	return dotVisitor(matrixA, matrixB, fromX, fromY, (a, b) => a - b);
}

function clone(matrix) {
	return matrix.reduce((acc, row, rowIndex) => {
		acc[rowIndex] = [...row];
		return acc;
	}, [])
}

function dotVisitor(matrixA, matrixB, fromX = 0, fromY = 0, visitor) {
	const result = clone(matrixA);
	matrixB.forEach((row, rowIndex) => {
		row.forEach((dot, dotIndex) => {
			let x = fromX + dotIndex;
			let y = fromY + rowIndex;
			if (result[y] && result[y][x] !== undefined) {
				result[y][x] = visitor(result[y][x], dot);
			}
		})
	});

	return result;
}