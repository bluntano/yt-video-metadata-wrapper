const videoUpdater = require('./videoUpdater');

console.log("> Testing out the wrapper...");
// insert video ID to updateVideoInfo function
// i.e.: https://www.youtube.com/watch?v=dQw4w9WgXcQ where 'dQw4w9WgXcQ' is the video ID
// make sure it's your own video though, otherwise errors will knock on your door init!

videoUpdater.getVideoMetadata('kXhapq5SN1I', (data) => {
    console.log(data);
});

let newDesc = [
    'Hahaaa',
    'Cool',
    '\n',
    '#Coding4Lif'
];
videoUpdater.setVideoMetadata('kXhapq5SN1I', 'Test 1', newDesc, ['testing', 'for', 'fun']);
