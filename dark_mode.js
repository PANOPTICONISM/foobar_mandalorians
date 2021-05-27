import Darkmode from 'darkmode-js';

const options = {
    bottom: '64px',
    right: '64px',
    time: '0.5s',
    mixColor: '#fff',
    backgroundColor: '#fff',
    buttonColorDark: '#1A5163',
    buttonColorLight: '#00704a',
    label: '🌓',
    autoMatchOsTheme: false
}

const darkmode = new Darkmode(options);
darkmode.showWidget();