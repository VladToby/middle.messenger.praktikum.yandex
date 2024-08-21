import Handlebars from 'handlebars';

Handlebars.registerHelper('eq', function(a, b) {
    return a == b;
});

Handlebars.registerHelper('formatDate', function(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    if (diffInHours > 24) {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
        const dayOfWeek = date.toLocaleDateString('en-EN', options);
        return `${dayOfWeek}, ${time}`;
    } else {
        return time;
    }
});

Handlebars.registerHelper('firstLetter', function(str: string) {
    return str ? str.charAt(0).toUpperCase() : '';
});
