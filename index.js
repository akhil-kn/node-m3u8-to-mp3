const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');

const config = {
    "cover": "./assets/cover.jpg",
    "name": `track_${new Date().getTime()}`,
    "m3u8_path": "https://vodhls-vh.akamaihd.net/i/songs/37/1888137/21532380/21532380_64.mp4/master.m3u8?set-akamai-hls-revision=5&hdnts=st=1548143330~exp=1548161330~acl=/i/songs/37/1888137/21532380/21532380_64.mp4/*~hmac=9957e0ae4a318261fc380e1a04fd986e28344246705da9832527ded1826aadd0",
    "bitrate": "320"
};
const command = ffmpeg(config.m3u8_path);
const file_path = `Music/${config.name}.mp3`;

command
    .on('progress', function (progress) {
        console.log('Processing: ' + Math.floor(progress.percent) + '% done');
    })
    .on('error', (err) => { console.log('An error occurred: ' + err.message); })
    .on('start', () => { console.log('Processing started !'); })
    .on('end', () => { addCover(); })
    .audioCodec('libmp3lame')
    .audioBitrate(config.bitrate)
    .mergeToFile('temp.mp3', './Music');

function addCover() {
    const cmd = `ffmpeg -i temp.mp3 -i ${config.cover} -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" \"${file_path}\" && del "temp.mp3"`;
    exec(cmd, () => {
        console.log(`Processing finished !\nfile path : ${encodeURI(file_path)}`);
    });
}