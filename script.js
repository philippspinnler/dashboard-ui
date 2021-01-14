dayjs.extend(dayjs_plugin_calendar);
dayjs.extend(dayjs_plugin_updateLocale);
dayjs.extend(dayjs_plugin_relativeTime);
dayjs.locale('de-ch');
dayjs.updateLocale('de-ch', {
    calendar: {
        lastDay: '[Gestern]',
        sameDay: '[Heute]',
        nextDay: '[Morgen]',
        lastWeek: '[Letzter] dddd',
        nextWeek: 'dddd',
        sameElse: 'dddd'
    }
});
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
});

axios.interceptors.request.use(function (config) {
    config.headers.Authorization = "Bearer UdCZbP-hAZfJUDJBxAFfg8KmQLwk8n";

    return config;
});

// const baseUrl = 'http://localhost:3000';
const baseUrl = 'http://10.0.86.177:3000';

Vue.component('widget-clock', {
    data() {
        return {
            hours: '',
            minutes: '',
            seconds: '',
            date: ''
        }
    },
    mounted() {
        setInterval(() => {
            const date = new Date();
            this.date = dayjs(date).format('dddd, D. MMMM YYYY')
            this.hours = dayjs(date).format('HH');
            this.minutes = dayjs(date).format('mm');
            this.seconds = dayjs(date).format('ss');
        }, 1000);
    },
    template: `<div class="widget-clock"><div class="clock-container"><div class="time">{{hours}}:{{minutes}}</div><div class="seconds">{{seconds}}</span></div></div><div class="date-container">{{date}}</div></div>`
});

Vue.component('widget-calendar', {
    data() {
        return {
            groupped: ''
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/ical`);
        
            const groupped = []
            for (let group of response.data.groupped) {
                group.dateDay = dayjs(group.date).calendar();
                group.date = dayjs(group.date).format('D. MMMM');
                group.events = group.events.map(event => {
                    event.startTime = event.allDay ? 'Den ganzen Tag' : dayjs(event.start).format("HH:mm");
                    if (event.summary.startsWith('Geburtstag ') && event.allDay) {
                        const birthYearMatch = / (\d{4})/gm.exec(event.summary);
                        let age = null;
                        if (birthYearMatch) {
                            const birthYear = birthYearMatch[1];
                            age = dayjs().startOf('day').diff(dayjs(new Date(birthYear)), 'year');
                        }


                        let name;
                        
                        if (birthYearMatch) {
                            name = event.summary.split(' ').slice(1, event.summary.split(' ').length-1).join(' ');
                        } else {
                            name = event.summary.split(' ').slice(1).join(' ');
                        }

                        event.birthday = {
                            name,
                            age
                        }
                    }
                    return event;
                })
                groupped.push(group);
            }
            this.groupped = groupped;
        }, 5000);
        
    },
    template: `<div><div v-for="group in groupped"><div class="date-container"><div class="day"><h1 class="title">{{group.dateDay}}</h1></div><div class="date subtitle">{{group.date}}</div></div><div class="event-container" v-for="event in group.events"><div class="event-birthday" v-if="event.birthday"><div><h2><i class="fa fa-gift" /> {{event.birthday.name}}</h2></div><div>{{event.birthday.age}}</div></div><div class="event" v-if="!event.birthday" v-bind:style="{ borderLeft: 'solid #'+event.color+' 10px' }"><div v-if="event.allDay" class="event-all-day"><span>{{event.startTime}}</span></div><h2 v-if="!event.allDay">{{event.startTime}}</h2>{{event.summary}}</div></div></div></div>`
});

Vue.component('widget-sonos', {
    data() {
        return {
            name: '',
            detail: '',
            image: '',
            currentlyPlaying: false
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/sonos`);
                
            if (response.status == 204) {
                this.currentlyPlaying = false;
            } else {
                this.currentlyPlaying = true;
                this.name = response.data.name;
                this.detail = response.data.detail;
                this.image = response.data.image;
            }
        }, 5000);
        
    },
    template: `<div><h1 class="title">Sonos</h1><div v-if="!currentlyPlaying"><p class="subtitle">Zurzeit wird nichts abgespielt</p></div><div v-if="currentlyPlaying" class="sonos-container"><div><h2>{{name}}</h2><p>{{detail}}</p></div><div v-if="image" class="artwork"><img v-bind:src="image"/></div></div></div>`
});

Vue.component('widget-netatmo', {
    data() {
        return {
            inside: '',
            co2: '',
            outside: ''
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/netatmo`);
            this.inside = response.data.temperature;
            this.co2 = response.data.co2;
            this.outside = response.data.modules[0].temperature;
        }, 5000);
    },
    template: '<div><h1 class="title">Netatmo</h1><p class="subtitle">Innen</p><h2>{{inside}} °C</h2><p class="subtitle">Aussen</p><h2>{{outside}} °C</h2><p class="subtitle">CO2</p><h2>{{co2}} ppm</h2></div>'
});

Vue.component('widget-public-transportation', {
    data() {
        return {
            hoelstein: '',
            hoelsteinInMinutes: '',
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/public-transportation?connections=[["Hoelstein-Weidbaechli", "Liestal"]]`);
            this.hoelstein = dayjs(response.data.connections[0].departure).format('HH:mm');
            this.hoelsteinInMinutes = dayjs().to(response.data.connections[0].departure);
        }, 5000);
    },
    template: '<div><h1 class="title">ÖV</h1><p class="subtitle">WB nach Liestal</p><h2><small style="font-size: 50%; margin-right: 50px;">{{hoelstein}} Uhr</small>{{hoelsteinInMinutes}}</h2></div>'
});

Vue.component('widget-essential-photos', {
    data() {
        return {
            facebook: '',
            instagram: '',
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/essential-photos`);
            this.facebook = response.data.facebook;
            this.instagram = response.data.instagram;
        }, 5000);
    },
    template: '<div><h1 class="title">Essentail-Photos</h1><h2>{{facebook}} <i class="fab fa-facebook-square"></i> {{instagram}} <i class="fab fa-instagram-square"></i></h2></div>'
});

Vue.component('widget-withings', {
    data() {
        return {
            mona: '',
            philipp: '',
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/withings`);
            this.mona = response.data.Mona.deltaSinceLastMeasure;
            this.philipp = response.data.Philipp.deltaSinceLastMeasure;
        }, 5000);
    },
    template: '<div><h1 class="title">Withings</h1><p class="subtitle">Mona</p><h2>{{mona}} kg</h2><p class="subtitle">Philipp</p><h2>{{philipp}} kg</h2></div>'
});

Vue.component('widget-internet', {
    data() {
        return {
            download: '',
            upload: '',
            speedtestDownload: '',
            speedtestUpload: '',
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`http://10.0.86.11:3000/api/overall`);
            this.download = response.data.donwloadUsagePretty;
            this.upload = response.data.uploadUsagePretty;
            this.speedtestDownload = response.data.speedTestResult.downloadSpeedPretty;
            this.speedtestUpload = response.data.speedTestResult.uploadSpeedPretty;
        }, 5000);
    },
    template: '<div><h1 class="title">Internet</h1><p class="subtitle">Traffic</p><h2>{{download}} <i class="fas fa-chevron-down"></i> {{upload}} <i class="fas fa-chevron-up"></i></h2><p class="subtitle">Speedtest</p><h2>{{speedtestDownload}} <i class="fas fa-chevron-down"></i> {{speedtestUpload}} <i class="fas fa-chevron-up"></i></h2></div>'
});

Vue.component('widget-eo-guide', {
    data() {
        return {
            total: '',
            review: '',
            stars: '',
            starsArray: []
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/eo-guide`);
            this.total = response.data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
            this.review = response.data.latestReview.reviewFormatted;
            this.stars = response.data.latestReview.stars;
            this.starsArray = [];
            for (let x = 0; x < this.stars; x++) {
                this.starsArray.push('');
            }
        }, 5000);
    },
    template: '<div><h1 class="title">EO-Guide</h1><p class="subtitle">Total Downloads</p><h2>{{total}}</h2><p class="subtitle">Letzte Bewertung</p><h3>{{review}}<br><i v-for="star in starsArray" class="fas fa-star"></i></h3></div>'
});

Vue.component('widget-weather', {
    data() {
        return {
            current: {
                temperature: '',
                temperatureFeelsLike: '',
                weather: {}
            },
            daily: []
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/weather`);
            const icons = {
                "01d": "fa fa-sun",
                "02d": "fa fa-cloud-sun",
                "03d": "fa fa-cloud",
                "04d": "fa fa-cloud",
                "09d": "fa fa-cloud-showers-heavy",
                "10d": "fa fa-cloud-sun-rain",
                "11d": "fa fa-bolt",
                "13d": "fa fa-snowflake",
                "50d": "fa fa-smog",
                "01n": "fa fa-sun",
                "02n": "fa fa-cloud-sun",
                "03n": "fa fa-cloud",
                "04n": "fa fa-cloud",
                "09n": "fa fa-cloud-showers-heavy",
                "10n": "fa fa-cloud-sun-rain",
                "11n": "fa fa-bolt",
                "13n": "fa fa-snowflake",
                "50n": "fa fa-smog"
            };
            this.current.temperature = Math.round(response.data.current.temperature * 10) / 10;
            this.current.temperatureFeelsLike = Math.round(response.data.current.temperatureFeelsLike * 10) / 10;
            this.current.weather = response.data.current.weather[0];
            this.current.weather.faIcon = icons[this.current.weather.icon];
            this.daily = response.data.daily.map(day => {
                return {
                    dateDay: dayjs(day.date).format("dd"),
                    temperature: {
                        min: Math.round(day.temperature.min * 10) / 10,
                        max: Math.round(day.temperature.max * 10) / 10
                    },
                    weather: day.weather.map(weather => {
                        return {
                            ...weather,
                            faIcon: icons[weather.icon]
                        }
                    })[0]
                }
            });
            this.daily = this.daily.slice(1, 5)
        }, 5000);
    },
    template: '<div class="weather-container"><div class="current-container"><h1><i v-bind:class="current.weather.faIcon"></i></h1><h2>{{current.temperature}} °C</h2></div><div class="daily-container" v-for="day in daily"><h2>{{day.dateDay}}</h2><h2><i v-bind:class="day.weather.faIcon"></i></h2><h3>{{day.temperature.max}} °C</h3><h3>{{day.temperature.min}} °C</h3></div></div>'
});

new Vue({
    el: '#app',
    data() {
        return {
            image: null,
            backgroundColor: 'rgba(0, 0, 0, 1)'
        }
    },
    async mounted() {

        const getImages = async () => {
            const response = await axios.get(`${baseUrl}/icloud-album`)
            this.image = response.data.images[Math.floor(Math.random() * response.data.images.length)]
        }

        const transistionStepSpeed = 50;

        const fadeToBlack = async () => {
            for (let x = 0.55; x <=1.05; x=x+0.05) {
                this.backgroundColor = `rgba(0, 0, 0, ${x})`;
                await new Promise(r => setTimeout(r, transistionStepSpeed));
            }
        }

        const fadeToTransparent = async () => {
            await new Promise(r => setTimeout(r, 1000));
            for (let x = 0.9; x >= 0.5; x = x - 0.05) {
                this.backgroundColor = `rgba(0, 0, 0, ${x})`;
                await new Promise(r => setTimeout(r, transistionStepSpeed));
            }
        }
        
        await getImages();
        await fadeToTransparent();

        setInterval(async () => {
            await fadeToBlack();
            await getImages();
            await fadeToTransparent();
        }, 5*1000*60);
    }
});