const videoUpdater = require('./ytMetadata');

console.log("> YouTube Metadata wrapper testing...");

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
