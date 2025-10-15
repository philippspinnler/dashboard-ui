import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/de-ch'

// Extend dayjs with plugins
dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)

// Set default locale
dayjs.locale('de-ch')

// Update calendar locale
dayjs.updateLocale('de-ch', {
  calendar: {
    lastDay: '[Gestern]',
    sameDay: '[Heute]',
    nextDay: '[Morgen]',
    lastWeek: '[Letzter] dddd',
    nextWeek: 'dddd',
    sameElse: 'dddd'
  }
})

// Update relative time locale
dayjs.updateLocale('de-ch', {
  relativeTime: {
    future: "in %s",
    past: "vor %s",
    s: 'ein paar Sekunden',
    m: "einer Minute",
    mm: "%d Minuten",
    h: "einer Stunde",
    hh: "%d Stunden",
    d: "einem Tag",
    dd: "%d Tage",
    M: "einem Monat",
    MM: "%d Monate",
    y: "einem Jahr",
    yy: "%d Jahre"
  }
})

export default dayjs
