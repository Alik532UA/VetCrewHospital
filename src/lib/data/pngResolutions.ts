export interface PngResolution {
	id: string;
	label: string;
	px: number;
	descriptionUk: string;
	descriptionEn: string;
}

export const PNG_RESOLUTIONS: PngResolution[] = [
	{
		id: '480p',
		label: '480p',
		px: 480,
		descriptionUk: 'Компактний (480 px)',
		descriptionEn: 'Compact (480 px)'
	},
	{
		id: '720p',
		label: '720p',
		px: 720,
		descriptionUk: 'HD (720 px)',
		descriptionEn: 'HD (720 px)'
	},
	{
		id: '1080p',
		label: '1080p',
		px: 1080,
		descriptionUk: 'Full HD (1080 px)',
		descriptionEn: 'Full HD (1080 px)'
	},
	{
		id: '1440p',
		label: '1440p',
		px: 1440,
		descriptionUk: '2K QHD (1440 px)',
		descriptionEn: '2K QHD (1440 px)'
	},
	{
		id: '2160p',
		label: '2160p',
		px: 2160,
		descriptionUk: '4K UHD (2160 px)',
		descriptionEn: '4K UHD (2160 px)'
	}
];

export const DEFAULT_PNG_RESOLUTION = PNG_RESOLUTIONS[2]!; // 1080p
