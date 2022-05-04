# youtube-video-metadata-wrapper
Lil cute YouTube video metadata wrapper written in Node.js

It is entirely made with base libraries that already is included with Node (`request`, `fs`).

**Be careful with the tokens as they give full access to your YouTube channel. Make sure they do not end up on wrong person's hand!**

## Usage
This wrapper is simple to use. There is only two functions to use: getting and setting metadata. I also included `testing.js` in this repo, for testing purpose. Though before using it, you will need to go through a setup.

```js
const ytMetadata = require('./ytMetadata');

/**
 * Getting video metadata
 * required: video ID
*/
ytMetadata.getVideoMetadata('kXhapq5SN1I', (data) => {
    console.log(data);
});

let newDesc = [
    'Hahaaa',
    'Cool',
    '\n',
    '#Coding4Lif'
];

/**
 * Setting video metadata
 * required: video ID, title
 * optional: description, tags, category ID
*/
ytMetadata.setVideoMetadata('kXhapq5SN1I', 'Test 1', newDesc, ['testing', 'for', 'fun']);

```

## Setup
You are required to have a Google account obviously.

1. Go to [Google Cloud Platform](https://console.cloud.google.com) site.
![screenshot 1](/screenshots/s1.png)
2. Make a new project. Name it how you want.
3. After project creation, navigate to APIs & Services.
![screenshot 2](/screenshots/s2.png)
4. Enable APIs and Services. It will direct you to API Library
5. From there search up "YouTube Data API v3"
6. Enable it. Once you got added to your library, navigate to OAuth consent screen.
7. Pick External and then Create.
![screenshot 3](/screenshots/s3.png)
8. Fill out the required fields. Optional ones too if you want, not necessary though.
9. Scopes: Add or Remove Scopes -> search up 'youtube.force-ssl'. Gives full access to the YouTube channel.
10. Test users: add i.e. your Gmail account there for the test user.
11. Summary: make sure everything is alright. If so, 'Back to dashboard'
12. Navigate to Credentials -> Create Credentials -> OAuth Client ID
13. Pick Web Application; name it; Add URI in Authorized redirect URIs; add something like `http://localhost/oauth2callback`. Any URI will work, though keep that in mind for coming steps
![screenshot 4](/screenshots/s4.png)
14. After successful OAuth credentials making, click to download JSON file of the tokens and, move it to the `ytMetadata.js` working directory. Rename it to `client_secret.json` (IMPORTANT)
15. Paste following link to the browser's address bar.
```
https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/youtube.force-ssl&
response_type=code&
access_type=offline&
redirect_uri={insert your redirect URI here}&
client_id={insert your OAuth client ID from the client secret file here}
```
16. Choose the account and channel you plan to use YouTube API on with this application
17. If you had redirect URI set as localhost and have nothing running to process OAuth2 callback, do not worry. It will still generate one for you. You can get it from the URI. Copy the URI from the address bar -> copy the token from code parameter.
![screenshot 5](/screenshots/s5.png)
18. Make a new JSON file called `tokens.json` -> Copy the code from the code parameter in the query and paste it to the tokens file like so:
```json
{
    "auth_code": "4%2F..."
}
```
19. Rest of the stuff you are now on your own. Install NPM / Node if you have not yet, play around with it, etc.

## Summary
Hopefully this user guide is coprehensible enough.

#
Bluntano, 2022
