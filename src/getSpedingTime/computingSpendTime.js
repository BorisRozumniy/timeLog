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

export const createTimeComputedText = srcString => {
    const tasksData = getTimeForParent(srcString)
    const rows = srcString.split('\n');
    const newRows = rows.map((row, index) => {
        let res = '';
        const time = computingSpendTime(row);
        const regexTimeWrapper = /\*\*.*\*\*/g;
        if (row.match(regexTimeWrapper))
            res = row.replace(regexTimeWrapper, `**${time}**`)
        else
            res = time === '' ? row : `${row} **${time}**`;
        // add time to parent task
        tasksData.forEach(task => {
            const ifIsParentTask = task.rowText === row
            if (ifIsParentTask) res = `${row} **${task.taskTime}**`
        });
        return res;
    });
    const result = newRows.join('\n');
    return result;
}

export const writeTimeToParent = srcString => {
    // const regex_taskWithSubtask = /- [A-Za-z]+-\d+(?:[^\n]*\n\s+- .*)*/g;
    const regex_taskWithSubtask = /\n-\s.*(GP-\d\d\d\d)+(?:[^\n]*\n\s+- .*)*/g;
    // const regex_taskWithSubtask = /^-\s.*(GP-\d\d\d\d)+(?:[^\n]*\n\s+- .*)*/g;
    // const regex_taskWithSubtask = /- (\[x\] |\[ \] |[A-Za-z]+-\d+)(?:[^\n]*\n\s+- .*)*/g;
    // - \[x\] .*(?:[^\n]*\n\s+- .*)*
    // - \[\s\] .*(?:[^\n]*\n\s+- .*)*
    // \[x|\s\]
    // - \[\s\] .*(?:[^\n]*\n\s+- .*)* |- \[x\] .*(?:[^\n]*\n\s+- .*)*
    // srcString.match(/\n## .*/g) // day row
    // const tasks = srcString.match(/\n- .*/g)
    // const sections = srcString.split('\n# ');
    const tasks = srcString.match(regex_taskWithSubtask)

    // console.log('ddd tasks', tasks);

    const updatedTusks = tasks.map(task => {
        let res = '';
        const taskTime = computingSpendTime(task);
        const rows = task.split('\n');
        const taskWithTime = taskTime === '' ? rows[1] : `${rows[1]} **${taskTime}**`;
        rows.splice(0, 2, taskWithTime)
        res = rows.join('\n');
        return res;
    });
    const result = updatedTusks.join('\n');
    return result;
}

export const getTimeForParent = srcString => {
    const regex = /- (\[ \] )?(\[x\] )?[A-Za-z]+(?:[^\n]*\n\s+- .*)*/g;
    const tasks = srcString.match(regex)
    const res = tasks.map(task => {
        const taskText = task
        const taskTime = computingSpendTime(taskText);
        const tasksRows = srcString.split('\n')
        const taskRows = taskText.split('\n')
        const rowText = taskRows[0];
        const rowNumber = tasksRows.findIndex(row => row === rowText)
        return { rowText, rowNumber, taskTime }
    })
    return res
}
