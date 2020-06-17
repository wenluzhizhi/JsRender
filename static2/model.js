/* The first element in each vertex should always be position */

var modelTriangle = {
	format: [3, 3, 2],	// position, color, uv
	vertices: [
		// One line for one vertex
		0, 0, 0,	1, 0, 0,	0, 1,
		1, 0, 0,	0, 1, 0,	1, 1,
		0, 1, 0,	0, 0, 1,	0, 0,
	],
};

var modelCube = {
	format: [3, 3, 2],	// position, color, uv
	vertices: [
		// One line for one vertex
		-1.0, 1.0, 1.0,		1, 0, 0,	0, 1,
		1.0, 1.0, 1.0,		0, 1, 0,	1, 1,
		1.0, 1.0, -1.0,		0, 0, 1,	1, 0,
		// -1.0, 1.0, 1.0,		1, 0, 0,	0, 1,
		// 1.0, 1.0, -1.0,		0, 0, 1,	1, 0,
		// -1.0, 1.0, -1.0,	1, 1, 0,	0, 0,

		// -1.0, -1.0, 1.0,	0, 0, 1,	0, 0,
		// -1.0, -1.0, -1.0,	0, 1, 0,	0, 1,
		// 1.0, -1.0, -1.0,	1, 0, 0,	1, 1,
		// -1.0, -1.0, 1.0,	0, 0, 1,	0, 0,
		// 1.0, -1.0, -1.0,	1, 0, 0,	1, 1,
		// 1.0, -1.0, 1.0,		1, 0, 1,	1, 0,

		// -1.0, -1.0, -1.0,	0, 1, 0,	0, 1,
		// -1.0, -1.0, 1.0,	1, 0, 0,	1, 1,
		// -1.0, 1.0, 1.0,		0, 0, 1,	1, 0,
		// -1.0, -1.0, -1.0,	0, 1, 0,	0, 1,
		// -1.0, 1.0, 1.0,		0, 0, 1,	1, 0,
		// -1.0, 1.0, -1.0,	1, 1, 1,	0, 0,

		// 1.0, -1.0, -1.0,	1, 0, 1,	1, 1,
		// 1.0, 1.0, -1.0,		0, 1, 0,	1, 0,
		// 1.0, 1.0, 1.0,		1, 1, 1,	0, 0,
		// 1.0, -1.0, -1.0,	1, 0, 1,	1, 1,
		// 1.0, 1.0, 1.0,		1, 1, 1,	0, 0,
		// 1.0, -1.0, 1.0,		0, 0, 1,	0, 1,

		// -1.0, -1.0, -1.0,	1, 0, 0,	1, 1,
		// -1.0, 1.0, -1.0,	0, 0, 1,	1, 0,
		// 1.0, 1.0, -1.0,		1, 0, 1,	0, 0,
		// -1.0, -1.0, -1.0,	1, 0, 0,	1, 1,
		// 1.0, 1.0, -1.0,		1, 0, 1,	0, 0,
		// 1.0, -1.0, -1.0,	0, 1, 0,	0, 1,

		// -1.0, -1.0, 1.0,	0, 1, 0,	0, 1,
		// 1.0, -1.0, 1.0,		1, 0, 1,	1, 1,
		// 1.0, 1.0, 1.0,		0, 1, 1,	1, 0,
		// -1.0, -1.0, 1.0,	0, 1, 0,	0, 1,
		// 1.0, 1.0, 1.0,		0, 1, 1,	1, 0,
		// -1.0, 1.0, 1.0,		1, 0, 0,	0, 0,
	],
};
