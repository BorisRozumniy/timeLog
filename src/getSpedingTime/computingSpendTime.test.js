import {
    getTimes,
    msSince1970,
    getIntervals,
    getSpendedTime,
    computingSpendTime,
    createTimeComputedText,
    getTimeForParent,
    writeTime,
} from './computingSpendTime'
import {
    text1, text2, text3, text4, text5, text6,
    resultOf_getTeims1, resultOf_getTeims2, resultOf_getTeims3, resultOf_getTeims4,
    resultOf_getcreateTimeComputedText1, for_text5, resultOf_getcreateTimeComputedText3,
    text7, text8, text9, text10, tasksData, text11, text12, text13, text14, text15,
    text16, text17, text18, text19, text20, text21, text22, text23, text24, text25,
} from './srcTest';

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
        expect(getSpendedTime([300, 30, 60])).toBe('6h 30m');
    });
    
    it('for an hour', () => {
        expect(getSpendedTime([30, 30, 60])).toBe('2h');
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

describe('getTimeForParent', () => {
    it('should to return time, rowNumber and rowText', () => {
        expect(getTimeForParent(text10)).toEqual(tasksData);
    });
})

describe('createTimeComputedText', () => {
    it('for one line', () => {
        expect(createTimeComputedText(text2)).toBe(resultOf_getcreateTimeComputedText1);
    });

    it('for multiple lines', () => {
        expect(createTimeComputedText(text5)).toBe(for_text5);
    });

    it('should to replace the time inside **time** template', () => {
        expect(createTimeComputedText(text6)).toBe(resultOf_getcreateTimeComputedText3);
    });

    it('should to add the time to each task', () => {
        expect(createTimeComputedText(text10)).toBe(text11);
    });
})

describe('writeTime should rewrite old **time**', () => {
    it('with new time', () => {
        expect(writeTime(text23, '18m')).toBe(text24);
    });

    it('with the same time', () => {
        expect(writeTime(text23, '15m')).toBe(text23);
    });

    it('without time', () => {
        expect(writeTime(text23, '')).toBe(text25);
    });

    it('withwrong params', () => {
        expect(writeTime()).toBe('');
    });
})

describe('createTimeComputedText should write the correct **time** to the parent task', () => {
    it('base', () => {
        expect(createTimeComputedText(text8)).toBe(text9);
    });

    it('do not changing subtasks', () => {
        expect(createTimeComputedText(text10)).toBe(text11);
    });

    it('if this task occurs two or more times', () => {
        expect(createTimeComputedText(text13)).toBe(text14);
    });

    it('rewrite old **time**', () => {
        expect(createTimeComputedText(text15)).toBe(text16);
        const text = `- GP-3333 **15m**
        - subtask1 <!-- [2023-06-13 08:00][2023-06-13 08:11] --> **10m**
        - subtask2 <!-- [2023-06-13 08:20][2023-06-13 08:25] --> **5m**`
        const res = `- GP-3333 **16m**
        - subtask1 <!-- [2023-06-13 08:00][2023-06-13 08:11] --> **11m**
        - subtask2 <!-- [2023-06-13 08:20][2023-06-13 08:25] --> **5m**` 
        expect(createTimeComputedText(text)).toBe(res);
    });

    it('parent task can be any string starting with "-"', () => {
        expect(createTimeComputedText(text17)).toBe(text18);
        expect(createTimeComputedText(text19)).toBe(text20);
        expect(createTimeComputedText(text21)).toBe(text22);
    });
})
