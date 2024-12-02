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

const baseUrl = 'https://api.dashboard.monphi.ch';

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
            days: []
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/calendar`);
            this.days = response.data;
        }, 5000);

    },
    template: `
        <div>
            <div v-for="day in days">
                <div class="date-container">
                    <div class="day">
                        <h1 class="title">{{day.day}}</h1>
                    </div>
                    <div class="date subtitle">{{day.date}}</div>
                </div>
                <div class="event-container" v-for="event in day.events">
                    <div class="event-birthday" v-if="event.birthday">
                        <div>
                        <h2><i class="fa fa-gift" /> {{event.birthday.name}}</h2>
                        </div>
                        <div>{{event.birthday.age}}</div>
                    </div>
                    <div class="event" v-if="!event.birthday" v-bind:style="{ borderLeft: 'solid #'+event.color+' 10px' }">
                        <div v-if="event.all_day" class="event-all-day">
                            <span>Den ganzen Tag</span>
                        </div>
                        <h2 v-if="!event.all_day">{{event.start_time}}</h2>
                        {{event.summary}}
                    </div>
                </div>
            </div>
        </div>`
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
            this.currentlyPlaying = response.data.playing;
            this.name = response.data.artist;
            this.detail = response.data.song;
            this.image = response.data.image;
        }, 5000);

    },
    template: `
        <div>
            <h1 class="title">Sonos</h1>
            <div v-if="!currentlyPlaying">
                <p class="subtitle">Zurzeit wird nichts abgespielt</p>
            </div>
            <div v-if="currentlyPlaying" class="sonos-container">
                <div>
                    <h2>{{name}}</h2>
                    <p>{{detail}}</p>
                </div>
                <div v-if="image" class="artwork">
                    <img v-bind:src="image"/>
                </div>
            </div>
        </div>`
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
            this.inside = response.data.indoor_temperature;
            this.co2 = response.data.indoor_co2;
            this.outside = response.data.outdoor_temperature;
        }, 5000);
    },
    template: `
        <div>
            <h1 class="title">Netatmo</h1>
            <p class="subtitle">Innen</p>
            <h2>{{inside}} °C</h2>
            <p class="subtitle">Aussen</p>
            <h2>{{outside}} °C</h2>
            <p class="subtitle">CO2</p>
            <h2>{{co2}} ppm</h2>
        </div>`
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
            const response = await axios.get(`${baseUrl}/public-transportation?connections=[["Hölstein, Süd", "Liestal, Bahnhof", "direct"]]`);
            this.hoelstein = dayjs(response.data.connections[0].departure).format('HH:mm');
            this.hoelsteinInMinutes = dayjs().to(response.data.connections[0].departure);
        }, 5000);
    },
    template: `
        <div>
            <h1 class="title">ÖV</h1>
            <p class="subtitle">WB nach Liestal</p>
            <h2>
                <small style="font-size: 50%; margin-right: 50px;">{{hoelstein}} Uhr</small> {{hoelsteinInMinutes}}
            </h2>
        </div>`
});

Vue.component('widget-internet', {
    data() {
        return {
            speedtests: []
        }
    },
    mounted() {
        setInterval(async () => {
            const response = await axios.get(`${baseUrl}/speedtest`);
            this.speedtests = response.data;
        }, 5000);
    },
    template: `
        <div>
            <h1 class="title">Internet</h1>
            <div v-for="speedtest in speedtests">
                <p class="subtitle">{{speedtest.provider}}</p>
                <h2>
                    {{speedtest.download}} <i class="fas fa-chevron-down"></i> {{speedtest.upload}} <i class="fas fa-chevron-up"></i>
                </h2>
            </div>
        </div>`
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
            this.total = response.data.total_formatted;
            this.review = response.data.latest_review.review_formatted;
            this.stars = response.data.latest_review.stars;
            this.starsArray = [];
            for (let x = 0; x < this.stars; x++) {
                this.starsArray.push('');
            }
        }, 5000);
    },
    template: `
        <div>
            <h1 class="title">EO-Guide</h1>
            <p class="subtitle">Total Downloads</p>
            <h2>{{total}}</h2>
            <p class="subtitle">Letzte Bewertung</p>
            <h3>{{review}}<br><i v-for="star in starsArray" class="fas fa-star"></i></h3>
        </div>`
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
            const response = await axios.get(`${baseUrl}/album`)
            this.image = response.data.images[Math.floor(Math.random() * response.data.images.length)]
        }

        const transistionStepSpeed = 50;

        const fadeToBlack = async () => {
            for (let x = 0.55; x <= 1.05; x = x + 0.05) {
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
        }, 5 * 1000 * 60);
    }
});