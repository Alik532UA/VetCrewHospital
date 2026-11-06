// Directory Wayfinding Stele Data & Icons
// Pure standalone vector paths normalized to 0 0 1254 1254 viewBox

export interface SteleDepartment {
	id: string;
	file: string;
	titleUk: string;
	titleEn: string;
	twoLines: boolean;
	line1?: string;
	line2?: string;
	paths: string[];
}

export const STELE_DEPARTMENTS: SteleDepartment[] = [
	{
		id: 'reception',
		file: 'reception.svg',
		titleUk: 'РЕЦЕПЦІЯ',
		titleEn: 'RECEPTION',
		twoLines: false,
		paths: [
			'M690,435.24v24.98c48-3.4,93.61,7.33,125.51,44.95,10.9,12.85,26.49,42.66,26.49,59.46v78.44h238.5c11.39,0,26.68,13.83,30.99,24,5.52,13.02,5.4,48.53-.61,61.31-4.5,9.56-19.57,22.61-30.38,22.61h-24.5l.98,282.26c-1.91,22.77-17.39,38.91-40.44,40.53H237.46c-19.38-.41-39.46-20.09-39.46-39.51v-282.27h-22.5c-12.22,0-28.33-14.01-32.99-24.99-4.94-11.67-5.17-44.24-1.24-56.17s20.25-27.75,33.23-27.75h229.5c1.85-37.12-6.13-75.65,10.14-110.27,13.36-28.42,40.93-52.8,70.34-63.61,23.23-8.54,47.91-9.66,72.52-8.97v-24.48c-40.58-21.54-70.53-61.78-75.99-107.92-17.45-147.62,183.02-219.03,263.01-92.94,45.04,71,20.1,162.44-54.02,200.36ZM619.79,199.72c-88.03,3.43-141.61,105.43-87.21,177.48,49.24,65.21,149.92,58.45,189.58-13.23,41.92-75.75-16.9-167.58-102.38-164.24ZM661,447.23c-24.66,4.97-50.68,6.38-75-1v34.47c13.01,13.67,22.75,36.59,35.15,49.81.69.74.89,2.01,2.34,1.65l37.51-53.46v-31.47ZM812,643.08v-75.44c0-27.72-31.81-59.89-56.02-69.93-17.3-7.17-46.06-10-64.53-7.56-3.8.5-6.42,5.08-8.86,8.13-16.78,20.97-31.26,47.94-48.06,67.89-5.22,6.2-12.5,7.42-19.48,3.43l-57.47-78.47c-39.78-5.74-82.29,6.05-106.99,39.12-6.18,8.28-16.58,28.24-16.58,38.39v74.44h378ZM180.76,672.27c-3.91.55-9.64,4.44-10.55,8.49-1,4.43-.84,25.73-.23,30.79.51,4.26,3.08,8.21,7.02,9.97,6.09,2.74,24.82,1.65,32.55,1.53,288.49-4.45,577.74,1.73,866.29-1.71,3.58-1.32,6.42-3.51,7.91-7.09,2.01-4.81,1.81-21.88,1.3-27.75-.73-8.52-3.46-13.44-12.53-14.46-288.29.7-576.8-1.39-864.96,1.05-7.84,1.42-19.72-1.83-26.79-.83ZM1026,751.99H229v282.27c0,3.24,6.56,10.23,10.17,10.82l774.88.23c4.6-.69,11.94-6.27,11.94-11.05v-282.27Z',
			'M684,844.91c22.62,4.88,61.45-10.34,64.04,24.44,1.18,15.91,1.64,47.49-.04,63-.99,9.18-9.19,19.1-18.6,20.39-14.16,1.94-31.11-2.01-45.41,1.09v42.47c0,2.15-4.67,11.26-6.35,13.15-4.35,4.89-10.73,6.91-17.11,7.38-22.76,1.69-47.81-1.15-70.8-.28-8.04-.64-19.74-12.44-19.74-20.24v-41.97l-1.5-1.5h-43c-.41,0-6.32-3.14-7.25-3.75-5.33-3.55-9.07-9.65-9.99-15.99-1.99-13.73-1.54-49.35-.3-63.72.67-7.74,4.63-15.46,11.1-19.88,1.05-.71,6.76-3.56,7.44-3.56h42l1.5-1.5v-39.97c0-7.56,10.99-18.45,18.74-19.25,24.05,1.18,51.1-2.39,74.8-.28,7.55.67,14.36,5.57,17.64,12.35.53,1.09,2.82,7.58,2.82,8.17v39.47Z',
			'M682.76,548.41c26.68,1.24,56.44-2.55,82.78-.3,9.58.82,15.36,5.65,16.47,15.52,1.02,9.08.83,28.72.03,38.01s-5.13,15.16-14.53,16.45c-26.8-1.79-56.61,2.37-83.04.04-19.75-1.74-14.19-19.13-14.41-32.56-.22-13.58-6.08-33.35,12.71-37.16ZM758,572.13h-65v21.98h65v-21.98Z'
		]
	},
	{
		id: 'pet-shop',
		file: 'pet-shop.svg',
		titleUk: 'ЗООМАГАЗИН',
		titleEn: 'PET SHOP',
		twoLines: false,
		paths: [
			'M810.99,418.01l104.55-.05c31.02,1.78,53.44,16.71,60.16,47.84,14.48,67.09,24.83,139.82,36.13,207.87,19.05,114.72,35.6,229.87,53.15,344.85,3.42,31.34-17.57,59.25-47.95,66.02-259.71,2.44-520.38,2.44-780.07,0-27.86-6.23-47.89-30.27-48.9-58.88,25-151.41,46.52-303.41,71.22-454.86,6.5-39.85,11.64-80.78,22.53-119.47,11.93-22.47,34.76-33.04,59.63-33.36,29.13-.38,59.13,2.07,88.05,1.04,3.52-.13,7.56-1.87,11.5-1,1.81-47.69-6.09-96.55,10.25-142.25,58.05-162.33,290.47-164.01,349.49-1,16.54,45.69,8.27,95.51,10.25,143.25ZM770,418v-97.49c-15.38-123.31-169.88-172.45-253.03-77.04-13.95,16.01-34.97,53.78-34.97,75.03v98c0,.3-1.27.77-1,1.5h289ZM441,454c-25.47.54-51.07-.71-76.54-.04-2.36.06-4.55,1-6.92,1.08-15.69.57-34.66-4.26-42.02,13.98l-86.39,554.61c-1.48,13.52,9.04,24.62,22.33,25.41h749.08c13.62-.26,24.25-10.84,24.49-24.48-27.71-186.1-56.18-372.07-87.53-557.55-7.1-13.95-18.25-11.26-31.04-11.96-2.37-.13-4.55-1-6.92-1.08-29.43-1.07-59.1.88-88.54.04v24c9.2,2.54,16.46,10.95,19.85,19.65,13.28,34.08-23.27,62.88-55.84,50.84-31.24-11.55-36.38-56.29-5.01-70.49v-24h-288v24c34.35,15.98,23.29,67.59-12.74,72.76-48.56,6.98-72.02-50.14-28.26-74.26v-22.5Z',
			'M613.78,753.28c23.38-2.64,44.29,3.1,62.24,18.21,19.96,16.81,28.18,44.09,45.02,63.98s38.34,32.14,51.14,54.86c20.21,35.85,13.73,82.5-23.5,103.84-41.79,23.96-81.36-7.74-125.21-7.21-43.33.52-78.05,32.3-122.38,6.46-35.72-20.82-42.15-66.54-23.6-101.44,12.6-23.69,33.64-35.19,50.49-54.51,26.82-30.74,36.45-78.62,85.8-84.2Z',
			'M703.78,578.28c53.6-6.44,69.37,53.73,59.92,95.92-9.07,40.51-53.23,89.51-96.61,60.21-52.22-35.28-25.27-148.69,36.69-156.13Z',
			'M530.76,578.26c77.8-10.53,110.79,129.94,45.92,159.92-49.97,23.1-90.14-40.69-92.67-83.69-1.74-29.44,13.38-71.72,46.75-76.23Z',
			'M819.8,701.3c19.96-1.53,38.39,7.6,48.62,24.78,37.06,62.22-49.96,160.94-106.92,116.92-52.79-40.79-2.8-137.03,58.3-141.7Z',
			'M421.79,701.3c65.33-6.05,122.64,99.67,67.54,141.53-45.79,34.79-105.3-20.23-113.88-66.78-6.3-34.2,7.99-71.2,46.34-74.76Z'
		]
	},
	{
		id: 'consultation',
		file: 'herpetology.svg',
		titleUk: 'ОГЛЯДОВА',
		titleEn: 'EXAMINATION ROOM',
		twoLines: false,
		paths: [
			'M826,589c5.97-2.89,11.87-5.95,18.03-8.47,88.87-36.31,182.75-9.68,229.14,75.8,51.55,94.98,37.97,256.56-93.24,269.1-1.44,9.39-3.16,17.83-7.76,26.24-7.68,14.01-20.92,22.94-36.79,25.21l-236.86.11c-14.83-1.36-26.88-10.25-30.65-24.85-7.03.26-17.28-2.29-22.33,3.9-9.32,16.76-16.07,35.53-29.02,49.98-45.97,51.3-129.2,38.68-155.37-25.66-22.27-54.74,12.68-80.4,45.37-116.34,14.92-16.41,23.51-30.65,43.81-42.19,35.69-20.28,81.53-16.26,121.18-16.82l1.49-.51c12.67-18.69,36.44-13.99,56.01-14.49-1.48-15.76,9.12-27.51,20.99-35.99-27.26,1.69-78.69-6.43-89.48-36.03-1.04-2.87-1.21-7.48-2.03-8.97-1.39-2.51-9.36-5.6-12.67-12.33-14.14-28.72,19.99-72.56,40.17-91.19,22.64-20.9,82.61-59.2,113.41-58.39,12.07.32,26.61,13.18,26.61,25.4v16.5ZM722.5,714c-7.23,1.12-16.96-.82-24.5,0,1.76,2.68,6.45,3.9,9.48,5.02,4.1,1.51,15.2,4.98,19.02,4.98h60.5v-15.5c0-3.89,8.85-9.1,12.62-9.45,19.91-1.86,17.53,24.97,13.14,37.21-2.9,8.08-16.78,27.42-24.77,30.23-4.66,1.64-9.9,1.93-14.97,4.03-7.19,2.96-17.47,9.57-14.02,18.48h48c1.55-12.31,14.13-21.16,21.4-31.1,5.13-7.02,9.86-13.31,10.64-22.36.91-10.54-4.08-24.4,4.31-32.19,7.74-7.18,22.28-3.18,24.42,7.38.67,3.28-1.05,12.18,1.87,13.13,10.95-.73,24.24,1.46,34.89.17,3.34-.4,6.42-2.47,10.08-2.92,11.45-1.41,25.21,1.19,24.46,15.42-.86,16.44-19.62,11.02-29.75,16.29-5.48,2.85-10.99,9.89-13.49,15.51-5.2,11.67,3.28,11.87,12.73,11.69s11.73-5.56,19.78-10.19c13.62-7.84,32.08-12.18,47.67-9.83-6.44-15.12-21.35-39.73-13.73-56.23,4.12-8.91,16.73-10.73,23.64-4.17,5.46,5.2,3.9,12.56,5.57,19.43,4.25,17.55,19.77,23.43,30.5,36.5,25.65,31.25,26.13,83.78-7.05,109.89-24.89,19.58-71.92,13.39-77.47-21.37-2.36-14.83,7.12-33.97,23.71-24.71,13.31,7.43-.67,19.39,12.45,25.55,19.58,9.18,36.3-15.43,27.87-34.87-16.72-38.56-83.98-18.09-84.28,28.48-.25,39.4,40.25,61.3,75.64,53.85,83.08-17.5,83.91-142,58.62-204.32-31.21-76.9-106.59-108.03-185.23-83.3-6.34,1.99-38.47,14.8-40.05,19.95-1.27,4.13.05,12.63-1.47,18.53-4.02,15.69-22.12,19.03-29.51,4.07-.45-8.56,2.74-66.65-.26-69.25-20.47,3.81-40.41,14.42-57.87,25.54-22.73,14.48-50.5,37.61-60.94,63.06-3.77,9.19-6.76,17.9,6.35,19.36,11.24,1.25,37.49-2.74,45.85,2.15,12.01,7.02,6.97,23.87-5.85,25.85ZM842,789h25c-4.59-12.26-.24-25.25,7.01-35.49.02-.75-7.05-.85-7.85-.35-.71.44-6.03,12.14-7.75,14.75-4.38,6.62-10.27,12.04-14.92,18.08-.78,1.01-1.93,1.26-1.49,3.01ZM885,831h-176v102h218.5c3.81,0,10.17-11.91,9.05-15.99-21.39-10.8-37.28-26.48-46.04-49.02-1.6-4.12-5.52-15.64-5.52-19.48v-17.5ZM667,846c-25.18,1.03-53.65-2.7-78.01,4.49-15.53,4.58-23.71,13.34-34.51,24.49-14.87,15.37-32.25,33.77-46,50-38.49,45.42,26.59,94.12,69.98,57.98,23.76-19.78,29.18-72.97,66.03-72.97h22.5v-64Z',
			'M617.21,549.2l-.22,36.8c10.09.65,23.24-.08,31.04,7.46,10.73,10.38,6.91,29.78-7.26,34.81-9.24,3.28-17.07-.5-26.57.94l-84.79,119.7c-8.36,11.51-24.08,12.23-33.94,2.11l-91.16-127.09c-33.41,7.85-67.57,15.57-97.99,31.9-44.79,24.05-74.08,65.52-79.31,116.69l-.27,270.73c-3.93,27.14-43.67,24.12-44.77-2.7v-276.08c5.88-74.23,54.41-133.72,122.79-160.21,31-12.01,64.05-16.53,96.31-23.86l-.55-35.39c-88.19-62.38-112.39-177.75-48.73-267.71,73.07-103.26,222.51-116.5,307.74-20.29,78.63,88.76,59.13,230.82-42.3,292.22ZM498.8,237.3c-101.89,7.75-167.79,116.91-126.65,211.06,46.03,105.34,193.43,118.96,261.27,27.56,78.16-105.3-5.52-248.44-134.62-238.62ZM576,570c-8.07.8-15.8,4.01-23.81,5.69-36.64,7.66-71.68,4.44-107.19-6.69v37.5l66.5,90.48,64.5-89.48v-37.5Z',
			'M302.78,769.28c44.43,2.34,93.9-4.08,137.75-.32,9.14.78,17.3,5.75,18.49,15.51,2.51,20.53-1.94,45.98,0,67.05-1.42,7.81-7.27,14.22-15.49,14.51-45.84-3.1-96.85,3.99-142.08,0-8.63-.76-14.29-6.38-16.37-14.63,1.53-20.56-2.35-44.8-.09-64.92,1.06-9.45,8.34-16.54,17.79-17.21Z',
			'M736.74,613.24c47.58-8.02,55.04,58.73,12.5,64.5-44.85,6.09-48.98-58.36-12.5-64.5ZM741.71,636.21c-8.25,1.85-9.19,15.72-.77,18.34,17.58,5.47,17.28-22.05.77-18.34Z'
		]
	},
	{
		id: 'procedures',
		file: 'ornithology.svg',
		titleUk: 'ПРОЦЕДУРНА',
		titleEn: 'PROCEDURES',
		twoLines: false,
		paths: [
			'M771,881c6.33-16.34,14.14-32.6,22.48-48.02,4.49-8.31,9.07-20.12,18.12-23.88,15.23-6.33,23.25,5.61,31.8,16,33.35,40.59,62.31,87.66,94.21,129.79,33,43.58,70.63,84.45,118.38,112.11-13.71-39.07-29.08-77.68-44.24-116.25-15.47-39.35-31.16-78.62-47.31-117.69-26.62-14.07-51.85-30.75-74.91-50.09-53.34-44.72-137.37-138.93-117.45-214.4,3.29-12.46,16.49-34.12,31.45-22.6,10.62,8.17,1.53,20.78-.25,30.8-5.69,32.09,13.07,66.54,29.7,92.74,47.11,74.25,125.02,139.17,211.01,162.01,1.21.32,1.34,1.14,1.01-1.02-36.88-99.74-79.55-208.25-158.48-282.54-15.85-14.92-37.96-28.21-48.95-47.05s-11.01-44.91-16.07-66.93c-7.83-34.06-25.04-66.67-54.98-86.02-43.63-28.19-105.84-18.81-137.36,22.71,27.62,35.49,49.06,78.52,45.88,124.86-1.5,21.9-14.02,39.65-16.9,61.1-1.64,12.21-1,23.15-.14,35.36-11.22-1.25-21.4,3.53-32,6-2.31-20.1-1.17-40.22,2.98-59.98-14.42-2.79-28.39-11.43-38.49-22.01-8.76,26.63-26.18,16.47-37.3-1.7-32.84-53.7-21.91-121.9,36.45-151.16,2.3-1.15,7.94-2.27,9.11-3.4.92-.88,2.55-5.75,3.83-7.67,48.12-72.5,161.09-70.59,215.39-5.56,34.14,40.88,32.93,73.2,43.47,121.53,5.85,26.83,24.09,34.54,42.57,51.43,64.33,58.83,106.2,132.04,140.45,211.55,13.51,31.35,31.93,73.94,39.24,106.76,2.33,10.47,5.52,24.13-6.01,30.42-17.31,9.44-49.95-6.01-66.7-13.21,20.5,47.67,40,95.95,57.74,144.75,7.83,21.55,18.74,47.92,22.78,70.22,8.46,46.67-30.39,39.7-58.45,23.45-74.16-42.94-143.16-151.97-194.9-221.1-4.91-6.56-9.96-13.3-14.2-20.31l-2.05.61-12.93,28.38h16.5c1.97,0,8.87,4.05,10.5,5.79,9.93,10.56,4.52,27.42-9.59,30.13l-174.15-.68c-17.62-7.46-13.62-32.55,5.32-35.15,6.38-.88,38.14,1.07,40.25-.25l22.02-46.58-.78-2.81c-13.85-10.01-26.56-22.48-37.05-35.97-3.29-4.23-26.11-37.49-23.02-40.47,5.64.48,10.56-.34,16.01-1.49,3.5-.74,14.54-5.54,15.53-5.52,2.65.05,6.71,10.97,8.29,13.68,15.46,26.58,35.51,47.78,63.09,61.98l-25.92,57.35h35ZM639,453.99c-3.06-13.18-8.84-26.29-15.48-38.02-3.59-6.33-10.87-18.3-15.64-23.35-.68-.72-.95-1.81-2.35-1.67-35.4,16.81-48.9,64.49-29.03,98.02,15.18-19.73,38.26-30.87,62.5-34.99ZM645,500.5c.81-6.83-.6-15,0-22-.76-.96-.84-1.16-2.06-1.12-3.43.11-17.04,5.43-20.9,7.15-6.07,2.7-11.65,6.18-17.05,9.98,8.22,11.26,21.44,18.13,34.44,22.53,1-.1,5.34-14.58,5.57-16.54Z',
			'M203.24,461.76c16.57,2.65,17.15,15.65,22.88,27.62,32.53,67.84,132.56,75.04,173.29,11.54,7.91-12.34,11.69-28.2,25.06-35.95,2.19-1.27,7.56-2.53,8.59-3.66,3.89-4.24,13.18-23.03,16.46-29.29,15.88-30.35,42.98-90.84,40.51-124.56-1.65-22.54-15.8-43.81-39.52-46.52-6.27,5.58-11.59,11.24-19.54,14.53-43.3,17.94-83.7-28.78-58.4-68.4,21.62-33.87,73.85-25.56,84.64,12.69,41.6,6.8,69.27,42.43,71.82,83.68,3.09,49.89-26.93,116.53-49.53,160.57-2.72,5.3-10.67,16.47-12.07,20.93-1.07,3.41-.77,8.52-1.73,12.27-2.61,10.25-7.91,19.49-13.91,28.09-24,34.4-62.43,58.85-103.39,67.65,1.68,9.78-.95,20.35-6.4,28.56-2.26,3.41-5.25,5.49-7,9-2.99,68.66,17.37,156.77,94.97,172.99,70.27,14.69,126.01-37.64,166.52-87.54,1.77-3.78-2.27-6.88-3.7-10.29-35.14-83.84,70.01-141.23,121.6-75.6,41.65,52.98-9.75,128.86-75.43,113.43-3.11-.73-12.42-4.91-13.98-4.07-1.35.73-16.07,20.64-19.03,24.03-51.06,58.4-124.1,101.92-203.49,72.54-82.4-30.49-108.79-127.3-106.46-207.31-11.67-8.22-13.75-23.17-13.16-36.56-43.23-11.91-85.16-42.19-106.38-82.12-7.08-13.32-4.8-16.69-7.95-29.05-1.97-7.72-15.75-29.42-20.22-38.78-19.28-40.42-45.47-106.71-34.81-151.19,8.58-35.8,37.6-65.03,74.28-71.22,16.26-53.46,95-40.38,91.21,16.71-2.49,37.43-47.44,55.86-76.46,32.49-7.39-5.95-5.23-10.19-16.32-7.27-30.7,8.08-37.67,39.89-34.08,67.68,5.89,45.68,30.13,92.09,51.12,132.37Z',
			'M707.76,379.26c30.5-3.94,33.79,42.56,3.69,43.77-27.3,1.1-31.19-40.22-3.69-43.77Z'
		]
	},
	{
		id: 'surgery',
		file: 'surgery.svg',
		titleUk: 'ОПЕРАЦІЙНА',
		titleEn: 'SURGERY',
		twoLines: false,
		paths: [
			'M646,709h373.5c17.67,0,36.05,19.25,37.54,36.46,1.25,14.5,1.53,45.82-.03,60.04s-19.07,34.49-33.51,34.49h-165.5v117h47.5c4.35,0,13.15,6.47,16.01,9.99,21.58,26.48-11.38,64.29-36.53,36.53H369.02c-21.04,23-50.54.83-42.08-27.07,2.36-7.78,13.17-19.44,21.56-19.44h46l1.5-1.5v-114l-1.5-1.5h-164c-17.66,0-34.32-23.89-34.54-40.55-.2-15.56-.39-39.86.99-54.99,1.55-16.91,20.4-35.46,37.54-35.46h372.5v-98c-71.53-1.82-147.58-16.43-210.67-50.83-126.79-69.12-147.14-205.12-24.05-291.39,131.43-92.11,384.31-92.2,514.04,3.4,102.2,75.32,104.93,196.3,0,270.63-67.07,47.51-156.72,65.27-237.81,68.19l-2.5,1.5v96.5ZM919.99,374c-17.59-54.42-71.94-88.16-122.74-107.75-91.64-35.35-204.04-37.63-298.67-13.17-66.06,17.07-140.85,52.66-165.58,120.91l32.48-23.01c126.71-80.2,336.14-86.81,472.49-28.45,29.41,12.59,58.53,29.78,82.02,51.47ZM605.79,322.29c-77.67,3.35-206.11,30.93-259.31,91.69-5.08,5.8-15.47,18.19-14.05,26.05,8.24,45.61,73.1,86.12,112.6,102.43,122.73,50.69,351.06,47.77,447.99-54.94,9.49-10.06,26.99-34.78,28.78-48.29.63-4.74-7.21-15.91-10.39-20.15-57.61-76.91-216.03-100.66-305.62-96.79ZM813,840h-371.5l-1.5,1.5v115.5h373v-117Z',
			'M621.79,341.3c35.74-1.56,92.44,20.5,76.68,65.68-11.02,31.61-57.7,40.68-86.85,36.9-85.71-11.11-75.32-98.85,10.17-102.58ZM617.79,376.29c-12.11,1.25-39.61,11.71-22.26,25.68,13.58,10.94,45.82,10.73,60.17,1.22,12.05-7.98,7.37-17.22-4-22.39-9.87-4.49-23.22-5.61-33.9-4.51Z',
			'M687.65,540.65c-35.48,35.45-140.08,25.15-135.53-33.03,4.78-61.08,127.84-66.44,146.64-9.88,5.14,15.47.2,31.61-11.11,42.91ZM615.78,493.28c-10.23,1.23-33.26,9.84-22.77,23.21,7.6,9.7,29.96,11.43,41.37,10.38,10.4-.96,36.2-8.51,26.06-22.8-7.83-11.03-32.42-12.26-44.65-10.79Z',
			'M788.79,402.29c35.9-3.47,88.99,16.51,78.93,60.93-11.68,51.58-105.08,56.48-129.89,12.44-21.17-37.57,15.06-69.9,50.96-73.37ZM795.79,436.3c-39.39,3.66-30.33,36.1,5.7,34.69,10.89-.42,37.22-8.58,27.52-23.49-6.04-9.28-23-12.15-33.21-11.2Z',
			'M441.79,402.29c38.49-3.92,93.21,19.44,77.24,66.24-16.88,49.48-114.44,49.11-131.81-.26-12.66-35.99,22.22-62.69,54.57-65.98ZM447.79,436.29c-11.02,1.12-32.7,9.58-23.25,23.66,5.11,7.61,21.32,11.25,29.96,11.12,11.36-.17,37.19-8.72,26.92-24-6.25-9.3-23.3-11.82-33.64-10.77Z'
		]
	},
	{
		id: 'hospital',
		file: 'hospital.svg',
		titleUk: 'СТАЦІОНАР',
		titleEn: 'HOSPITAL',
		twoLines: false,
		paths: [
			'M983,546l-.88,429.42,1.53,1.43c22.72-.78,42.53,18.6,46.9,40.1,7.06,34.71-19.67,64.99-54.01,67.09l-700.91-.17c-37.61-3.29-57.06-35.12-49.39-71.13,3.81-17.88,24.81-36.57,43.76-35.74v-429.5l-1.5-1.5h-46c-4.12,0-14.47-7.24-17.53-10.47-16.71-17.67-13.11-43.05,5.01-58.04l383.68-282.32c18.99-14.29,44.45-14.97,64.06-1.39l386.29,284.71c17.19,14.27,19.84,40.64,4.01,57.04-2.94,3.05-13.7,10.47-17.53,10.47h-47.5ZM255,502h41.5c.39,0,6.25,2.35,7.18,2.82,7.06,3.52,12.06,10.93,13.32,18.68.49,127.44-.81,255.35.04,381.96.16,23.84-.21,47.71-.04,71.54h98c-4.71-3.93-10.29-6.45-15.01-10.49-30.16-25.76-28.95-75.43,13.91-84.61,3.47-55.53,37.94-108.83,89.43-131.08,20.98-9.06,43.77-13.14,66.57-13.93l4.03-19.8c-39.67-20.8-75.24-54.84-93.1-96.42-28.36-66.01,6.89-112.35,75.85-78.85,41.54,20.17,73.78,61.65,92.46,103.03,33.11-3.83,63.99,1.78,92.38,19.13,42.94,26.25,80.17,78.19,51.65,128.69-10.37,18.36-27.25,29.95-45.65,39.27,4.79,29.78-4.21,59.36-19.37,84.75-.22,2.23,10.12,8.4,12.32,10.34,15.09,13.4,24.43,29.19,24.53,49.97h168.5c1.02-.75,1.08-.87,1.09-2.04.48-149.12-1.59-298.31-.58-447.45,1.27-9.09,5.68-18.53,14.31-22.69,1.09-.53,7.59-2.82,8.18-2.82h41.5l-367.04-271.45-10.32.59L255,502ZM731,976c1.16-16.86-16.96-28.95-30.64-34.86-6.05-2.61-16.92-4.56-21.66-7.33-1-.58-1.91-.87-1.75-2.3,19.59-26.74,45.04-59.07,37.61-94.56-1.9-9.08-10.33-18.33-2.1-26.99,3.96-4.17,12.99-5.15,18.53-7.47,39.15-16.39,50.95-47.92,23.99-82.96-22-28.6-61.9-47.56-98.24-41.29-9.09,1.57-19.9,13.15-28.59-.88-4.11-6.63-7.61-18.63-11.63-26.37-16.8-32.39-48.76-72.25-85-83-32.84-9.74-31.58,9.92-22.54,34.54,11.84,32.25,40.47,60.86,69.11,78.89,9,5.66,21.28,10.25,29.25,15.75,12.44,8.59,1.92,19.25-1.37,29.3-1.96,6-3.78,14.72-4,20.99-.31,8.81,4.71,22.44-8.53,24.48-11.31,1.74-26.89-.81-38.92.08-70.58,5.22-111.35,67.79-108.47,134.45.79,18.17-11.59,8.05-20.58,7.52-18.62-1.11-15.17,18.63-4.38,27.43,8.53,6.95,14.09,5.39,23.17,7.83s15.49,20.85,27.05,25.94c6.1,2.69,7.35.54,12.19.73,31.05,1.17,63.76,1.36,94.96.05,6.6-.28,13.27.45,19.88-.12,19.06-23.68,16.24-74.73-18.13-82.54-9.22-2.09-18.64.9-24.65-8.35-5.34-8.21-2.42-20.2,6.56-24.35,8.81-4.07,27.33-.1,36.25,3.54,42.33,17.25,53.53,72.43,37.64,111.86h95ZM277.74,1016.24c-13.11,2.21-14.44,19.45-2.3,23.82,233.88,1.74,468.43,1.23,702.37.26,15.3-4.29,12.25-23.62-3.28-24.35l-696.8.28Z',
			'M671,467v56.5c0,.44-3.68,6.68-4.5,7.5-2.61,2.61-6.39,3.7-9.96,4.04-19.9,1.88-42.75-1.42-62.97-.1-3.68.12-11.56-7.55-11.56-10.44v-57.5h-56.5c-5.55,0-12.18-8.88-12.31-14.49-.44-19.68,1.96-40.09.86-59.96-.13-3.16,7.25-10.55,9.45-10.55h57l1.5-1.5v-56c0-2.89,7.89-10.55,11.56-10.44,20.49,1.39,43.85-2.07,63.99-.11,5.21.51,13.45,6.12,13.45,11.55v55l1.5,1.5h57c3.57,0,8.88,7.82,9.41,11.59,1.72,12.15,1.37,47.28.14,59.96-.52,5.34-5.86,13.45-11.55,13.45h-56.5Z',
			'M689.79,714.21c21.9-1.71,25.05,32.19,2.69,33.82-21.88,1.6-24.27-32.13-2.69-33.82Z'
		]
	},
	{
		id: 'laboratory',
		file: 'laboratory.svg',
		titleUk: 'ЛАБОРАТОРІЯ',
		titleEn: 'LABORATORY',
		twoLines: false,
		paths: [
			'M622,954.5c4.12-30.46,31.38-35.28,53.68-45.32,49.82-22.45,92.76-71.45,109.79-123.21,22.69-68.98,9.75-143.53-36.48-199.51-27.01,4.85-53.45.13-75.46-16.46-.99.23-3.68,6.2-4.38,7.65-10.92,22.48-20.9,49.82-32.97,71.03-9.84,17.3-29.76,21.5-47.2,12.75l-26.76,54.29c-14.64,20.46-30.34,17.19-50.57,8.14-12.73-5.69-63.08-28.24-70.18-35.82-7.51-8.02-9.28-21.02-6.18-31.26l27.65-55.18c-16.5-8.24-23.36-24.32-16.79-41.97,8.83-23.76,27.47-55.04,39.35-78.65,43.03-85.52,87.2-170.49,129.72-256.28,7.69-12.56,16.4-16.86,31.34-15.74,2.93.22,7.53,2.69,8.96,1.08l14.32-30.72c-5.73-8.38-6.43-19.65-3.12-29.12,3.88-11.08,20.45-42.81,27.1-52.9,14.99-22.76,34.59-15.3,54.55-6.16,29.06,13.3,57.77,28.27,86.14,42.86,8.74,9.5,10.23,20.89,5.99,32.98s-20.63,44.38-27.66,55.34c-2.92,4.55-7,8.71-11.92,11.08-3.6,1.73-14.07,3.39-15.41,4.59-4.23,3.79-9.3,23.57-14.09,29.01-.95,3.56,4.01,4.16,6.1,6,14.39,12.63,14.29,29.91,7.68,46.68-10.86,27.58-27.39,54.98-38.35,82.65-.85,2.16-1.96,4.24-1.83,6.67,23.39,3.57,44.76,18.2,57.64,37.87,2.64,4.03,5.89,12.58,7.92,15.08,2.5,3.08,17.27,12.25,21.93,16.07,81.09,66.62,118.88,175.7,107.4,279.35-8.12,73.26-37.08,134.8-81.9,192.1-8.54,10.92-23.36,21.62-21.98,36.52h48.5c11.62,0,35.32,10.24,45.23,16.77,35.38,23.35,45.38,61.95,41.26,102.71-2.94,29.13-36.17,27.6-57.99,26.51v19.5c0,.6-3.46,7.79-4.17,8.83-3.95,5.79-11.43,9.12-18.29,9.71-11.6,1-41.87,1.45-52.79-.28-5.47-.86-12-5.32-15.18-9.82-.58-.82-3.56-6.07-3.56-6.44v-21.5h-385v16.5c0,10.32-10.47,20.38-20.5,21.5-10.77,1.21-44.42,1.39-54.76-.24-6.65-1.05-18.74-10.28-18.74-17.26v-19c-.63-.99-1.38-1.29-2.5-1.5-7.72-1.41-19.56.84-27.99-.01-11.99-1.21-23.86-10.86-26.06-22.94s-.97-40.4,1.84-52.25c9.59-40.4,48.66-68.29,89.16-70.84l108.54.04v-115h-150.5c-8.17,0-20.53-10.8-23.98-18.02-5.12-10.73-5.23-50.87-1.01-61.96s15.05-19.34,26.94-20.06l342.6.48c10.27,2.13,20.63,13.31,22.49,23.51,1.72,9.44,1.42,37.48.5,47.59-1.07,11.75-14.09,28.46-26.54,28.46h-150.5v115h97.5l1.5-1.5c.91-9.39-1.23-20.91,0-30l-.03.02ZM781.92,195.93l17.65-36.94-74.49-35.93-18.08,37.92,74.92,34.95h0ZM738.92,251.93l13.65-29.96-51.56-24.98c-.36,5.77-14.85,27.42-12.57,31l50.48,23.93h0ZM603.94,624.96l41.89-89.72c-19.43-50.35,3.4-104.93,53.65-124.27l49.36-108.68-101.41-51.31-161.33,318.53,117.84,55.45h0ZM720.76,446.26c-65.98,8.4-50.43,117.97,19.29,102.29,59.51-13.38,47.33-110.77-19.29-102.29h0ZM797,986c.12-4.4-.31-8.84.26-13.24,2.68-20.95,28.57-45.28,41.13-62.87,49.57-69.39,73.53-153.75,59.29-239.08-9.66-57.92-38.47-114.55-82.18-153.82-4.23,20.26-15.15,37.84-30.47,51.51,58.71,71.92,66.65,179.11,25.5,261.54-24.76,49.6-69.32,92.5-120.19,114.81-5.49,2.41-20.52,6.57-23.88,9.12-9.14,6.93-4.77,20.37-6.51,29.54l1.54,2.49h135.51ZM530.92,688.93l21.97-44.45-53.8-25.42-21.61,44.99,53.44,24.89h0ZM322,1095h608.5l1.5-1.5v-19c0-21.55-25.91-47.18-46.96-50.04-171.71-2.45-344.38-2.42-516.09-.02-19.85,2.62-46.95,27.56-46.95,48.05v22.5h0Z',
			'M627.79,352.21c10.66-.79,17.13,11.48,12.39,20.48l-68.8,135.2c-10.87,14.08-29.63,3.37-23.61-13.61l68.36-134.64c2.82-3.89,6.67-7.07,11.65-7.44h0Z'
		]
	}
];

export const STELE_ARROW_PATH = 'M6 12H18M18 12L13 7M18 12L13 17';

import { getOracalColorByCode } from './oracal641Data';

export {
	ORACAL_641_PALETTE,
	ORACAL_CATEGORIES,
	STELE_ORACAL_PRESETS,
	getOracalColorByCode,
	getOracalColorByHex,
	type OracalColor,
	type OracalCategory,
	type OracalCategoryMeta,
	type SteleOracalPreset
} from './oracal641Data';

export interface SteleColorPreset {
	id: string;
	nameUk: string;
	nameEn: string;
	bg: string;
	fg: string;
	border: string;
	previewDot: string;
}

export const STELE_COLOR_PRESETS: SteleColorPreset[] = [
	{
		id: 'classic-green',
		nameUk: 'Фірмовий зелений (як на фото)',
		nameEn: 'Brand Green (Classic)',
		bg: '#00783F', // 068M Grass green
		fg: '#003C24', // 060M Dark green
		border: '#003C24', // 060M Dark green
		previewDot: '#00783F'
	},
	{
		id: 'dark-luxury',
		nameUk: 'Темно-зелений контраст',
		nameEn: 'Deep Green Contrast',
		bg: '#005236', // 613M Forest green
		fg: '#6AA72F', // 063M Lime-tree green
		border: '#6AA72F',
		previewDot: '#005236'
	},
	{
		id: 'light-clean',
		nameUk: 'Світлий клінічний',
		nameEn: 'Light Clinical',
		bg: '#E7EAEE', // 010M White
		fg: '#003C24', // 060M Dark green
		border: '#003C24',
		previewDot: '#E7EAEE'
	},
	{
		id: 'gold-accent',
		nameUk: 'Золотий преміум',
		nameEn: 'Gold Accent',
		bg: '#003C24', // 060M Dark green
		fg: '#796532', // 091M Gold
		border: '#796532',
		previewDot: '#796532'
	}
];

export type SteleTextCase = 'uppercase' | 'titlecase';

export function formatSteleTitle(title: string, textCase: SteleTextCase = 'uppercase'): string {
	if (textCase === 'uppercase') {
		return title.toUpperCase();
	}
	return title
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

export interface SteleConfig {
	width: number;
	height: number;
	iconSize: number;
	fontSize: number;
	dividerThickness: number;
	dividerInset: number;
	sidePadding: number;
	verticalPadding: number;
	arrowAngle: number;
	bgColor: string;
	fgColor: string;
	borderColor: string;
	borderOffset?: number;
	borderThickness?: number;
	textCase?: SteleTextCase;
	bgOracalCode?: string;
	fgOracalCode?: string;
	borderOracalCode?: string;
}

/**
 * Calculates the SVG outer contour path with the signature slanted top and rounded corners.
 */
export function getSteleOuterPath(width: number, height: number, r = 22): string {
	const slantY = Math.round(width * 0.095);
	return [
		`M ${r} ${slantY}`,
		`L ${width - r} 0`,
		`A ${r} ${r} 0 0 1 ${width} ${r}`,
		`L ${width} ${height - r}`,
		`A ${r} ${r} 0 0 1 ${width - r} ${height}`,
		`L ${r} ${height}`,
		`A ${r} ${r} 0 0 1 0 ${height - r}`,
		`L 0 ${slantY + r}`,
		`A ${r} ${r} 0 0 1 ${r} ${slantY}`,
		'Z'
	].join(' ');
}

/**
 * Calculates the inner decorative inset border path.
 * Insets the path by (bOffset + bThickness / 2) so that when stroked with bThickness,
 * the stroke's outer edge strictly touches (width - bOffset, height - bOffset)
 * and NEVER exceeds the outer board boundary [0, width] x [0, height].
 */
export function getSteleInnerPath(
	width: number,
	height: number,
	bOffset = 10,
	r = 22,
	bThickness = 0
): string {
	const totalOffset = bOffset + bThickness / 2;
	const slantY = Math.round(width * 0.095);
	const innerR = Math.max(4, r - totalOffset);
	const innerW = width - 2 * totalOffset;
	const innerH = height - 2 * totalOffset;

	return [
		`M ${totalOffset + innerR} ${totalOffset + slantY}`,
		`L ${totalOffset + innerW - innerR} ${totalOffset}`,
		`A ${innerR} ${innerR} 0 0 1 ${totalOffset + innerW} ${totalOffset + innerR}`,
		`L ${totalOffset + innerW} ${totalOffset + innerH - innerR}`,
		`A ${innerR} ${innerR} 0 0 1 ${totalOffset + innerW - innerR} ${totalOffset + innerH}`,
		`L ${totalOffset + innerR} ${totalOffset + innerH}`,
		`A ${innerR} ${innerR} 0 0 1 ${totalOffset} ${totalOffset + innerH - innerR}`,
		`L ${totalOffset} ${totalOffset + slantY + innerR}`,
		`A ${innerR} ${innerR} 0 0 1 ${totalOffset + innerR} ${totalOffset + slantY}`,
		'Z'
	].join(' ');
}

/**
 * Generates a self-contained, valid standalone vector SVG string
 * with exact physical dimensions in millimeters.
 */
export function generateSteleSvg(config: SteleConfig): string {
	const {
		width,
		height,
		iconSize,
		fontSize,
		dividerThickness,
		dividerInset,
		sidePadding,
		verticalPadding,
		arrowAngle,
		bgColor,
		fgColor,
		borderColor
	} = config;

	const bOffset = config.borderOffset ?? 6;
	const bThickness = config.borderThickness ?? 7;
	const textCase = config.textCase ?? 'uppercase';
	const outerD = getSteleOuterPath(width, height);
	const innerD = getSteleInnerPath(width, height, bOffset, 22, bThickness);
	const slantY = Math.round(width * 0.095);

	const topY = slantY + bOffset + bThickness + verticalPadding;
	const bottomY = height - bOffset - bThickness - verticalPadding;
	const availH = bottomY - topY;
	const rowH = availH / 7;

	const arrowSize = Math.max(16, Math.round(iconSize * 0.72));
	const arrowScale = (arrowSize / 24).toFixed(4);
	const iconScale = (iconSize / 1254).toFixed(5);

	const bgCode = config.bgOracalCode ? ` [ORACAL 641 ${config.bgOracalCode}]` : '';
	const fgCode = config.fgOracalCode ? ` [ORACAL 641 ${config.fgOracalCode}]` : '';
	const borderCode = config.borderOracalCode ? ` [ORACAL 641 ${config.borderOracalCode}]` : '';

	let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
	svg += `<!-- Production Plotter Specification: ORACAL® 641 Economy Cal (Matt) -->\n`;
	svg += `<!-- Background: ${bgColor}${bgCode} -->\n`;
	svg += `<!-- Graphics: ${fgColor}${fgCode} -->\n`;
	svg += `<!-- Border: ${borderColor}${borderCode} -->\n`;
	svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm">\n`;
	svg += `  <desc>ORACAL 641 Economy Cal Specification: Background ${bgColor}${bgCode}, Graphics ${fgColor}${fgCode}, Border ${borderColor}${borderCode}</desc>\n`;
	svg += `  <defs>\n`;
	svg += `    <style>\n`;
	svg += `      .stele-text {\n`;
	svg += `        font-family: Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n`;
	svg += `        font-weight: 700;\n`;
	svg += `        text-anchor: start;\n`;
	svg += `        letter-spacing: 0.02em;\n`;
	svg += `      }\n`;
	svg += `    </style>\n`;
	svg += `  </defs>\n\n`;

	// Background and decorative frame
	svg += `  <!-- Main Asymmetric Board Fill -->\n`;
	svg += `  <path d="${outerD}" fill="${bgColor}" />\n\n`;

	svg += `  <!-- Inner Decorative Border Rim -->\n`;
	svg += `  <path d="${innerD}" fill="none" stroke="${borderColor}" stroke-width="${bThickness}" stroke-linejoin="round" />\n\n`;

	// Dividing lines (6 dividers between 7 rows)
	svg += `  <!-- Row Dividers -->\n`;
	const leftDivX = Math.max(0, dividerInset);
	const rightDivX = Math.min(width, width - dividerInset);
	for (let i = 0; i < 6; i++) {
		const divY = (topY + (i + 1) * rowH).toFixed(2);
		svg += `  <line x1="${leftDivX}" y1="${divY}" x2="${rightDivX}" y2="${divY}" stroke="${fgColor}" stroke-width="${dividerThickness}" stroke-linecap="round" />\n`;
	}
	svg += `\n`;

	// 7 Department Rows
	svg += `  <!-- Department Rows -->\n`;
	STELE_DEPARTMENTS.forEach((dep, i) => {
		const cy = topY + (i + 0.5) * rowH;
		const iconX = bOffset + bThickness + sidePadding;
		const iconY = cy - iconSize / 2;
		const textX = iconX + iconSize + 14;
		const arrowX = width - bOffset - bThickness - sidePadding - arrowSize;
		const arrowY = cy - arrowSize / 2;

		svg += `  <!-- Row ${i + 1}: ${dep.titleUk} -->\n`;
		svg += `  <g id="row-${dep.id}">\n`;

		// Icon
		svg += `    <g transform="translate(${iconX.toFixed(2)}, ${iconY.toFixed(2)}) scale(${iconScale})">\n`;
		dep.paths.forEach((p) => {
			svg += `      <path d="${p}" fill="${fgColor}" />\n`;
		});
		svg += `    </g>\n`;

		// Text
		if (dep.twoLines && dep.line1 && dep.line2) {
			const y1 = (cy - fontSize * 0.12).toFixed(2);
			const y2 = (cy + fontSize * 0.95).toFixed(2);
			const l1 = formatSteleTitle(dep.line1, textCase);
			const l2 = formatSteleTitle(dep.line2, textCase);
			svg += `    <text class="stele-text" x="${textX.toFixed(2)}" y="${y1}" fill="${fgColor}" font-size="${fontSize}px">${l1}</text>\n`;
			svg += `    <text class="stele-text" x="${textX.toFixed(2)}" y="${y2}" fill="${fgColor}" font-size="${fontSize}px">${l2}</text>\n`;
		} else {
			const textY = (cy + fontSize * 0.36).toFixed(2);
			const formattedTitle = formatSteleTitle(dep.titleUk, textCase);
			svg += `    <text class="stele-text" x="${textX.toFixed(2)}" y="${textY}" fill="${fgColor}" font-size="${fontSize}px">${formattedTitle}</text>\n`;
		}

		// Arrow
		const rotateAttr = arrowAngle !== 0 ? ` rotate(${arrowAngle} 12 12)` : '';
		svg += `    <g transform="translate(${arrowX.toFixed(2)}, ${arrowY.toFixed(2)}) scale(${arrowScale})${rotateAttr}">\n`;
		svg += `      <path d="${STELE_ARROW_PATH}" fill="none" stroke="${fgColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />\n`;
		svg += `    </g>\n`;

		svg += `  </g>\n\n`;
	});

	svg += `</svg>`;
	return svg;
}

/* ==========================================================================
   CONFIG SERIALIZATION, SHARING & IMPORT PARSER
   ========================================================================== */

export interface SteleParsedConfig {
	width: number;
	borderThickness: number;
	borderOffset: number;
	textCase: SteleTextCase;
	iconSize: number;
	fontSize: number;
	dividerThickness: number;
	dividerInset: number;
	sidePadding: number;
	verticalPadding: number;
	arrowAngle: number;
	bgOracalCode: string;
	fgOracalCode: string;
	borderOracalCode: string;
	isBorderLinked: boolean;
}

function toBase64(str: string): string {
	if (typeof btoa === 'function') {
		return btoa(unescape(encodeURIComponent(str)));
	}
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(str, 'utf8').toString('base64');
	}
	return '';
}

function fromBase64(b64: string): string {
	if (typeof atob === 'function') {
		return decodeURIComponent(escape(atob(b64)));
	}
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(b64, 'base64').toString('utf8');
	}
	return '';
}

/**
 * Serializes the current stele state into a compact, URL-safe VCH1 token.
 */
export function serializeSteleConfig(config: SteleConfig, isBorderLinked = true): string {
	const payload = {
		v: 1,
		w: config.width,
		bt: config.borderThickness ?? 7,
		bo: config.borderOffset ?? 6,
		tc: config.textCase === 'titlecase' ? 't' : 'u',
		is: config.iconSize,
		fs: config.fontSize,
		dt: config.dividerThickness,
		di: config.dividerInset,
		sp: config.sidePadding,
		vp: config.verticalPadding,
		aa: config.arrowAngle,
		bg: config.bgOracalCode ?? '068M',
		fg: config.fgOracalCode ?? '060M',
		bc: config.borderOracalCode ?? config.fgOracalCode ?? '060M',
		bl: isBorderLinked ? 1 : 0
	};
	return `VCH1:${toBase64(JSON.stringify(payload))}`;
}

/**
 * Parses and strictly validates a stele configuration string.
 * Supports:
 * - Hybrid message containing "VCH1:..."
 * - Standalone token "VCH1:..."
 * - Share URL containing "?stele=VCH1:..."
 * - Raw JSON
 */
export function parseSteleConfig(
	input: string
): { success: true; data: SteleParsedConfig } | { success: false; error: string } {
	if (!input || typeof input !== 'string') {
		return { success: false, error: 'Порожній текст конфігурації.' };
	}

	let token = input.trim();
	const urlMatch = token.match(/[?&]stele=([A-Za-z0-9+/=_%-]+)/i);
	if (urlMatch && urlMatch[1]) {
		token = decodeURIComponent(urlMatch[1]);
	}

	const match = token.match(/VCH1:([A-Za-z0-9+/=_-]+)/);
	let jsonStr: string;

	if (match && match[1]) {
		try {
			jsonStr = fromBase64(match[1]);
		} catch {
			return {
				success: false,
				error: 'Некоректний код конфігурації. Будь ласка, перевірте скопійований текст.'
			};
		}
	} else if (token.startsWith('VCH1:')) {
		try {
			jsonStr = fromBase64(token.slice(5));
		} catch {
			return {
				success: false,
				error: 'Некоректний код конфігурації. Будь ласка, перевірте скопійований текст.'
			};
		}
	} else {
		jsonStr = token;
	}

	let obj: Record<string, unknown>;
	try {
		obj = JSON.parse(jsonStr);
	} catch {
		return {
			success: false,
			error: 'Некоректний код конфігурації. Будь ласка, перевірте скопійований текст.'
		};
	}

	if (!obj || typeof obj !== 'object') {
		return {
			success: false,
			error: 'Некоректний код конфігурації.'
		};
	}

	const rawWidth = Number(obj.w ?? obj.width);
	if (isNaN(rawWidth) || rawWidth < 350 || rawWidth > 750) {
		return { success: false, error: 'Ширина стели має бути від 350 до 750 мм.' };
	}

	const rawBorderThickness = Number(obj.bt ?? obj.borderThickness ?? 7);
	if (isNaN(rawBorderThickness) || rawBorderThickness < 2 || rawBorderThickness > 18) {
		return { success: false, error: 'Товщина рамки має бути від 2 до 18 мм.' };
	}

	const rawBorderOffset = Number(obj.bo ?? obj.borderOffset ?? 6);
	if (isNaN(rawBorderOffset) || rawBorderOffset < 0 || rawBorderOffset > 16) {
		return { success: false, error: 'Відступ рамки має бути від 0 до 16 мм.' };
	}

	const rawTextCase: SteleTextCase =
		obj.tc === 't' || obj.textCase === 'titlecase' ? 'titlecase' : 'uppercase';

	const rawIconSize = Number(obj.is ?? obj.iconSize ?? 44);
	if (isNaN(rawIconSize) || rawIconSize < 28 || rawIconSize > 65) {
		return { success: false, error: 'Розмір іконок має бути від 28 до 65 мм.' };
	}

	const rawFontSize = Number(obj.fs ?? obj.fontSize ?? 22);
	if (isNaN(rawFontSize) || rawFontSize < 14 || rawFontSize > 34) {
		return { success: false, error: 'Розмір шрифту має бути від 14 до 34 мм.' };
	}

	const rawDividerThickness = Number(obj.dt ?? obj.dividerThickness ?? 2.5);
	if (isNaN(rawDividerThickness) || rawDividerThickness < 1 || rawDividerThickness > 8) {
		return { success: false, error: 'Товщина ліній має бути від 1 до 8 мм.' };
	}

	const rawDividerInset = Number(obj.di ?? obj.dividerInset ?? 24);
	if (isNaN(rawDividerInset) || rawDividerInset < 0 || rawDividerInset > 60) {
		return { success: false, error: 'Втяжка ліній має бути від 0 до 60 мм.' };
	}

	const sidePadding = Math.max(12, Math.min(40, Number(obj.sp ?? obj.sidePadding ?? 22)));
	const verticalPadding = Math.max(8, Math.min(30, Number(obj.vp ?? obj.verticalPadding ?? 14)));
	const arrowAngle = Math.max(0, Math.min(360, Number(obj.aa ?? obj.arrowAngle ?? 0)));

	const bgOracalCode = String(obj.bg ?? obj.bgOracalCode ?? '068M').trim();
	const fgOracalCode = String(obj.fg ?? obj.fgOracalCode ?? '060M').trim();
	const borderOracalCode = String(obj.bc ?? obj.borderOracalCode ?? fgOracalCode).trim();
	const isBorderLinked = obj.bl === 1 || obj.bl === undefined || obj.isBorderLinked === true;

	if (!getOracalColorByCode(bgOracalCode)) {
		return { success: false, error: `Невідомий код плівки фону: "${bgOracalCode}".` };
	}
	if (!getOracalColorByCode(fgOracalCode)) {
		return { success: false, error: `Невідомий код плівки графіки: "${fgOracalCode}".` };
	}
	if (!getOracalColorByCode(borderOracalCode)) {
		return { success: false, error: `Невідомий код плівки рамки: "${borderOracalCode}".` };
	}

	return {
		success: true,
		data: {
			width: rawWidth,
			borderThickness: rawBorderThickness,
			borderOffset: rawBorderOffset,
			textCase: rawTextCase,
			iconSize: rawIconSize,
			fontSize: rawFontSize,
			dividerThickness: rawDividerThickness,
			dividerInset: rawDividerInset,
			sidePadding,
			verticalPadding,
			arrowAngle,
			bgOracalCode,
			fgOracalCode,
			borderOracalCode,
			isBorderLinked
		}
	};
}

/**
 * Generates hybrid friendly text for clipboard sharing.
 */
export function generateSteleShareText(config: SteleConfig, token: string): string {
	const bg = config.bgOracalCode ?? '068M';
	const fg = config.fgOracalCode ?? '060M';
	const bc = config.borderOracalCode ?? fg;
	const bgCol = getOracalColorByCode(bg);
	const fgCol = getOracalColorByCode(fg);

	return [
		`📐 Макет стели Vet Crew Hospital (${config.width} × 800 мм)`,
		`• Плівки ORACAL 641: Фон ${bg} (${bgCol?.nameEn ?? ''}) + Графіка ${fg} (${fgCol?.nameEn ?? ''})`,
		`• Рамка: ${config.borderThickness ?? 7} мм (плівка ${bc})`,
		`• Розміри: Іконки ${config.iconSize} мм, Шрифт ${config.fontSize} мм`,
		`\nКод конфігурації:\n${token}\n`,
		`Щоб переглянути: відкрийте сторінку макета в брендбуці та натисніть «📥 Завантажити конфіг».`
	].join('\n');
}

/**
 * Generates a direct share URL with embedded configuration token.
 */
export function generateSteleShareUrl(token: string, baseUrl?: string): string {
	const base =
		baseUrl ||
		(typeof window !== 'undefined'
			? `${window.location.origin}${window.location.pathname}`
			: 'https://vet-crew-hospital.org/brandbook');
	return `${base}#door-signs?stele=${encodeURIComponent(token)}`;
}
