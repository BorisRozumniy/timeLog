export const getTimes = text => {
	const regex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g;
	const datesArray = text.match(regex);
	return datesArray
}

export const msSince1970 = timeStr => {
	const ndt = new Date(timeStr)
	const ms = ndt.getTime()
	return ms
}

export const getIntervals = (times) => {
	const res = []
	for (let i = 0; i < times.length; i = i + 2) {
		let
			t2 = msSince1970(times[i + 1]),
			t1 = msSince1970(times[i])
		if (t2)
			res.push(
				(t2 - t1) / 60000
			)
	}
	return res
}

export const getSpendedTime = (arr) => {
	const initialValue = 0;
	const sum = arr.reduce(
		(accumulator, currentValue) => accumulator + currentValue,
		initialValue
	);

	let
		h = Math.floor(sum / 60) !== 0 ? `${Math.floor(sum / 60)}h ` : '',
		m = sum % 60 !== 0 ? `${sum % 60}m` : ''
	return `${h}${m}`
}

export const computingSpendTime = (text) => {
	const datesArray = getTimes(text)
	const intervals = getIntervals(datesArray)
	const spendedTime = getSpendedTime(intervals)
	return spendedTime
}

export const createTimeComputedText = data => {
  const rows = data.split('\n');
  const newRows = rows.map(row => {
		const time = computingSpendTime(row);
    const res = time === '' ? row : `${row} **${time}**`;
    return res;
  });
  const result = newRows.join('\n');
  return result;
}
