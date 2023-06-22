export const getTimes = text => {
    const regex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g;
    const datesArray = text.match(regex);
    return datesArray || [];
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

export const getTimeForParent = srcString => {
    const regex = /- ((\[x\] |\[ \]){0,1}|[A-Za-z]{1,}-\d{1,})(?:[^\n]{0,}\n\s{1,}- .{0,}){0,}/g;
    const tasks = srcString.match(regex)
    if(!tasks) return [];
    const matches = []
    const res = tasks.map((task) => {
        const taskText = task
        const taskTime = computingSpendTime(taskText);
        const tasksRows = srcString.split('\n')
        const taskRows = taskText.split('\n')
        const rowText = taskRows[0];

        const rowNumber = tasksRows.findIndex((row, index) => {
            if (row === rowText && !matches.includes(index)) {
                matches.push(index)
                return row === rowText
            }
        })
        return { rowText, rowNumber, taskTime }
    })
    return res
}

export const createTimeComputedText = srcString => {
    const tasksData = getTimeForParent(srcString)
    const rows = srcString.split('\n');
    const newRows = rows.map((row, index) => {
        let res = '';
        const time = computingSpendTime(row);
        const regexTimeWrapper = /\*\*.*\*\*/g;
        // replace old time if the row has new time
        if (row.match(regexTimeWrapper))
            res = row.replace(regexTimeWrapper, `**${time}**`)
        else
            res = time === ''
            // return row if it without time
            ? row
            // add time to row if it has time but it hasn't time before
            : `${row} **${time}**`;
        // add time to parent task
        const currentTaskTime = tasksData.find(task => task.rowNumber === index)
        if (currentTaskTime?.taskTime) res = `${row} **${currentTaskTime.taskTime}**`;
        return res;
    });
    const result = newRows.join('\n');
    return result;
}

// export const writeTimeToParent = srcString => {
//     // const regex_taskWithSubtask = /- [A-Za-z]+-\d+(?:[^\n]*\n\s+- .*)*/g;
//     const regex_taskWithSubtask = /\n-\s.*(GP-\d\d\d\d)+(?:[^\n]*\n\s+- .*)*/g;
//     // const regex_taskWithSubtask = /^-\s.*(GP-\d\d\d\d)+(?:[^\n]*\n\s+- .*)*/g;
//     // const regex_taskWithSubtask = /- (\[x\] |\[ \] |[A-Za-z]+-\d+)(?:[^\n]*\n\s+- .*)*/g;
//     // - \[x\] .*(?:[^\n]*\n\s+- .*)*
//     // - \[\s\] .*(?:[^\n]*\n\s+- .*)*
//     // \[x|\s\]
//     // - \[\s\] .*(?:[^\n]*\n\s+- .*)* |- \[x\] .*(?:[^\n]*\n\s+- .*)*
//     // srcString.match(/\n## .*/g) // day row
//     // const tasks = srcString.match(/\n- .*/g)
//     // const sections = srcString.split('\n# ');
//     const tasks = srcString.match(regex_taskWithSubtask)

//     // console.log('ddd tasks', tasks);

//     const updatedTusks = tasks.map(task => {
//         let res = '';
//         const taskTime = computingSpendTime(task);
//         const rows = task.split('\n');
//         const taskWithTime = taskTime === '' ? rows[1] : `${rows[1]} **${taskTime}**`;
//         rows.splice(0, 2, taskWithTime)
//         res = rows.join('\n');
//         return res;
//     });
//     const result = updatedTusks.join('\n');
//     return result;
// }
