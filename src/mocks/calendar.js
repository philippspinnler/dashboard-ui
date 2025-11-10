export default [
  {
    day: 'Montag',
    date: '27. Oktober',
    events: [
      {
        summary: 'Team Meeting',
        start_date: '2025-10-27T09:00:00+01:00',
        start_time: '09:00',
        all_day: false,
        name: 'Work Calendar',
        color: '#3788d8'
      },
      {
        summary: 'Dentist Appointment',
        start_date: '2025-10-27T14:30:00+01:00',
        start_time: '14:30',
        all_day: false,
        name: 'Personal Calendar',
        color: '#e67c73'
      },
      {
        summary: 'Geburtstag Max Mustermann',
        start_date: '2025-10-27T00:00:00+01:00',
        start_time: '00:00',
        all_day: true,
        name: 'Personal Calendar',
        color: '#4285F4',
        special_event: {
          type: 'birthday',
          name: 'Max Mustermann',
          years: 35
        }
      }
    ]
  },
  {
    day: 'Dienstag',
    date: '28. Oktober',
    events: [
      {
        summary: 'National Holiday',
        start_date: '2025-10-28T00:00:00+01:00',
        start_time: '00:00',
        all_day: true,
        name: 'Holidays',
        color: '#33b679'
      },
      {
        summary: 'Project Review',
        start_date: '2025-10-28T10:00:00+01:00',
        start_time: '10:00',
        all_day: false,
        name: 'Work Calendar',
        color: '#3788d8'
      },
      {
        summary: 'Hochzeitstag Schmidt',
        start_date: '2025-10-28T00:00:00+01:00',
        start_time: '00:00',
        all_day: true,
        name: 'Personal Calendar',
        color: '#E67C73',
        special_event: {
          type: 'anniversary',
          name: 'Schmidt',
          years: 10
        }
      }
    ]
  },
  {
    day: 'Mittwoch',
    date: '29. Oktober',
    events: [
      {
        summary: 'Yoga Class',
        start_date: '2025-10-29T08:30:00+01:00',
        start_time: '08:30',
        all_day: false,
        name: 'Personal Calendar',
        color: '#f4511e'
      },
      {
        summary: 'Dinner with Friends',
        start_date: '2025-10-29T18:00:00+01:00',
        start_time: '18:00',
        all_day: false,
        name: 'Personal Calendar',
        color: '#8e24aa'
      }
    ]
  },
  {
    day: 'Donnerstag',
    date: '30. Oktober',
    events: [
      {
        summary: 'Client Call',
        start_date: '2025-10-30T13:00:00+01:00',
        start_time: '13:00',
        all_day: false,
        name: 'Work Calendar',
        color: '#3788d8'
      }
    ]
  },
  {
    day: 'Fr',
    date: '31. Oktober',
    events: [
      {
        summary: 'Halloween Party',
        start_date: '2025-10-31T00:00:00+01:00',
        start_time: '00:00',
        all_day: true,
        name: 'Personal Calendar',
        color: '#f4511e'
      },
      {
        summary: 'Geburtstag Sarah Schmidt',
        start_date: '2025-10-31T00:00:00+01:00',
        start_time: '00:00',
        all_day: true,
        name: 'Personal Calendar',
        color: '#4285F4',
        special_event: {
          type: 'birthday',
          name: 'Sarah Schmidt',
          years: 28
        }
      }
    ]
  }
]
