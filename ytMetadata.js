/*
MIT License
-------------------------
Copyright (c) 2022 Bluntano
*/
const { request } = require('https');
const fs = require('fs');
const client_secret = require('./client_secret.json').web;

let writeIntoTokens = (data) => {

    let tokens = require('./tokens.json');
    let dateNow = new Date();

    fs.readFile('tokens.json', 'utf-8', (err, str) => {
        if (err) throw err;

        /*
            NOTE: It also checks if the data doesn't have a new refresh token, it would keep the old one.
            So that the application doesn't crap out. Fucking brick!
         */
        tokens = JSON.parse(str);
        tokens['authorized'] = {
            refresh_token: !data.refresh_token ? tokens.authorized.refresh_token : data.refresh_token,
            access_token: data.access_token,
            tokens_createdAt: dateNow,
            tokens_expiresAt: new Date(dateNow.getTime() + (data.expires_in * 1000))
        };

        fs.writeFile('tokens.json', JSON.stringify(tokens, null, 4), 'utf-8', err => {
            if (err) throw err;
            console.log('> Updated tokens.json file successfully!');
        });
    });
};

// for refreshing access token
let refreshToken = (refresh_token, callback) => {
    request({
        host: 'oauth2.googleapis.com',
        path: `/token?client_id=${client_secret.client_id}&client_secret=${client_secret.client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`,
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            callback(data);
        });
    }).end();
};

// for getting access token
let getAccessToken = (callback) => {

    let tokens = require('./tokens.json');

    request({
        host: "oauth2.googleapis.com",
        path: `/token?code=${tokens.auth_code}&client_id=${client_secret.client_id}&client_secret=${client_secret.client_secret}&redirect_uri=${client_secret.redirect_uris[0]}&grant_type=authorization_code`,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
            data = JSON.parse(data);
        });
        res.on('end', () => {
            // on first time launching the code
            // stores refresh token into tokens.json file
            // for next time
            if (!tokens.hasOwnProperty('authorized') && data.refresh_token && !data.error) {
                writeIntoTokens(data);
                callback(null, data);

            // bad request when access token already exists
            // then refreshes token, gets new access token
            } else if (data.error == 'invalid_grant' && data.error_description == 'Bad Request' && tokens.authorized.refresh_token) {
                tokens = require('./tokens.json');
                if (new Date(tokens.authorized.tokens_expiresAt) <= new Date()) {
                    refreshToken(tokens.authorized.refresh_token, (tokendata) => {
                        //console.log(tokendata);
                        writeIntoTokens(tokendata);
                        data.access_token = tokendata.access_token;
                        callback(null, data);
                    });
                } else { data.access_token = tokens.authorized.access_token; callback(null, data); }
            } else callback(`${data.error}, ${data.error_description}`, data);
        });
    }).end();
};

exports.getVideoMetadata = (videoID, callback) => {
    getAccessToken((err, tokenData) => {
        if (err) throw err;
        //console.log(tokenData);
        let accessToken = tokenData.access_token

        request({
            host: "youtube.googleapis.com",
            path: `/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoID}`,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                data = JSON.parse(data);
                
                let videoData = {};
                if (data.hasOwnProperty('items')) { videoData = data.items[0]; }
                else console.error("> Oops... try again! Items object was empty.");

                //console.log(videoData);
                callback(videoData);
            });
        }).end();
    });
};

exports.setVideoMetadata = (videoID, title, description = [], tags = [], categoryId = 24) => {

    let desc = '';
    for (let i = 0; i < description.length; i++) {
        desc += description[i] + "\n";
    };

    getAccessToken((err, tokenData) => {
        if (err) throw err;
        let accessToken = tokenData.access_token;
        let bodyString = JSON.stringify({
            "id": videoID,
            "kind": "youtube#video",
            "snippet": {
                "title": title,
                "description": desc,
                "categoryId": categoryId,
                "tags": tags
            }
        });

        request({
            host: "www.googleapis.com",
            path: `/youtube/v3/videos?part=id,snippet`,
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": 'application/json',
                "Content-Type": 'application/json',
                "Content-Length": bodyString.length
            }
        }, (res) => {

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                data = JSON.parse(data);
                if (data.error) console.error(`> Error occured: \n${data.error.code} ${data.error.message}`);
                else { console.info(`> Updated video metadata!`); console.log(data); };
            });
        }).write(bodyString);
    });
};

// for revoking token
// just in case!
let revokeToken = (token) => {
    request({
        host: "oauth2.googleapis.com",
        path: `/revoke?token=${token}`,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    }, (res) => {
        let str = '';
        res.on('data', (chunk) => {
            str += chunk;
        });
        res.on('end', () => {
            str = JSON.parse(str);
            console.log(str);
        });
    }).end();
};
