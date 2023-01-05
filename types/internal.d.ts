export type Options = {
	name: string;
};

export type File = {
	name: string;
	contents: string;
};

export type Condition =
	| 'eslint'
	| 'prettier'
	| 'typescript'
	| 'checkjs'
	| 'playwright'
	| 'vitest'
	| 'skeleton'
	| 'default'
	| 'skeletonlib';

export type Common = {
	files: Array<{
		name: string;
		include: Condition[];
		exclude: Condition[];
		contents: string;
	}>;
};
