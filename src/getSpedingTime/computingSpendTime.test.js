import { getTimes, msSince1970, getIntervals, getSpendedTime, computingSpendTime, createTimeComputedText } from './computingSpendTime'

const text1 = 'text <!-- [2023-05-15 08:12] [2023-05-15 08:20] -->'
const text2 =
	'- [ ] GP-5853 <!-- [2023-05-16 08:10][2023-05-16 08:14] [2023-05-16 08:39][2023-05-16 08:42] [2023-05-16 08:55][2023-05-16 09:01]-->' // 13m
const text3 =
	' [ ] GP-5853 <!-- [2023-05-16 08:10][2023-05-16 08:14] [2023-05-16 08:39][2023-05-16 08:42] [2023-05-16 08:55]-->'
const text4 =
	' [ ] GP-5853 <!-- [2023-05-16 08:10]-->'
const text5 = `
## 2023-05-17
- [x] GP-5828 fix for the missed category <!-- [2023-05-17 07:02][2023-05-17 08:55] [2023-05-17 09:09][2023-05-17 09:18]-->
- [ ] HP GP-5818 - need to change content for golf page with KIn <!-- [2023-05-17 10:51][2023-05-17 11:22] -->
  - [x]  added the golfPage to the locales
  - [ ]  deploy to dev <!-- [2023-05-17 11:55][2023-05-17 13:36] -->
- [ ] timer [2023-05-17 09:24][2023-05-17 10:50]
- [ ] GP-5853 <!-- [2023-05-17 14:05][2023-05-17 14:59] -->
  - [ ] try to understand where is bug
`
	
const resultOf_getTeims1 = ['2023-05-15 08:12', '2023-05-15 08:20'] // 8
const resultOf_getTeims2 = ['2023-05-16 08:10', '2023-05-16 08:14', '2023-05-16 08:39', '2023-05-16 08:42', '2023-05-16 08:55', '2023-05-16 09:01'] // 13m
const resultOf_getTeims3 = ['2023-05-16 08:10', '2023-05-16 08:14', '2023-05-16 08:39', '2023-05-16 08:42', '2023-05-16 08:55']
const resultOf_getTeims4 = ['2023-05-16 08:10']
const resultOf_getcreateTimeComputedText1 = "- [ ] GP-5853 <!-- [2023-05-16 08:10][2023-05-16 08:14] [2023-05-16 08:39][2023-05-16 08:42] [2023-05-16 08:55][2023-05-16 09:01]--> **13m**"
const resultOf_getcreateTimeComputedText2 = `
## 2023-05-17
- [x] GP-5828 fix for the missed category <!-- [2023-05-17 07:02][2023-05-17 08:55] [2023-05-17 09:09][2023-05-17 09:18]--> **2h 2m**
- [ ] HP GP-5818 - need to change content for golf page with KIn <!-- [2023-05-17 10:51][2023-05-17 11:22] --> **31m**
  - [x]  added the golfPage to the locales
  - [ ]  deploy to dev <!-- [2023-05-17 11:55][2023-05-17 13:36] --> **1h 41m**
- [ ] timer [2023-05-17 09:24][2023-05-17 10:50] **1h 26m**
- [ ] GP-5853 <!-- [2023-05-17 14:05][2023-05-17 14:59] --> **54m**
  - [ ] try to understand where is bug
`

describe('getTimes', () => {
	it('getTimes with one interval', () => {
		expect(getTimes(text1)).toEqual(resultOf_getTeims1);
	});
	
	it('getTimes with several intervals', () => {
		expect(getTimes(text2)).toEqual(resultOf_getTeims2);
	});
	
	it('getTimes with odd intervals', () => {
		expect(getTimes(text3)).toEqual(resultOf_getTeims3);
	});
	
	it('getTimes with one item', () => {
		expect(getTimes(text4)).toEqual(resultOf_getTeims4);
	});

	it('getTimes without any data-time', () => {
		expect(getTimes('random text')).toEqual([]);
	});
})

describe('msSince1970', () => {
	it('msSince1970 should to convert string date to ms', () => {
		expect(msSince1970('2023-05-16 08:10')).toBe(1684217400000);
	})
})

describe('getIntervals', () => {
	it('getIntervals should to return array of intervals between each pairs of times', () => {
		expect(getIntervals(resultOf_getTeims1)).toEqual([8]);
		expect(getIntervals(resultOf_getTeims2)).toEqual([4, 3, 6]);
		expect(getIntervals(resultOf_getTeims3)).toEqual([4, 3]);
		expect(getIntervals(resultOf_getTeims4)).toEqual([]);
	})
})

describe('getSpendedTime shoul return spended time in the "1h 34m" format', () => {
	it('for minutes', () => {
		// expect(computingSpendTime('[2023-05-16 09:11][2023-05-16 10:02]')).toBe('8m');
		expect(getSpendedTime([8])).toBe('8m');
		expect(getSpendedTime([4, 3, 6])).toBe('13m');
		expect(getSpendedTime([4, 3])).toBe('7m');
		expect(getSpendedTime([])).toBe('');
	});
	
	it('for hours', () => {
		expect(getSpendedTime([83])).toBe('1h 23m');
		expect(getSpendedTime([30, 30, 60])).toBe('2h ');
		expect(getSpendedTime([300, 30, 60])).toBe('6h 30m');
	});
})

describe('computingSpendTime', () => {
	it('for one line', () => {
		expect(computingSpendTime(text2)).toBe('13m');
	});
	
	it('for multiple lines', () => {
		expect(computingSpendTime(text5)).toBe('6h 34m');
	});
})

describe('createTimeComputedText', () => {
	it('for one line', () => {
		expect(createTimeComputedText(text2)).toBe(resultOf_getcreateTimeComputedText1);
	});
	
	it('for multiple lines', () => {
		expect(createTimeComputedText(text5)).toBe(resultOf_getcreateTimeComputedText2);
	});
})
