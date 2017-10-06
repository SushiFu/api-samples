# Carrelage

## Prerequisites
### Optimize for VSCode
- Docker
- Node/Npm
- Yarn
- ESLint

### Build
```bash
$ yarn build #or run Build Task in VSCode
```

### Launch in Dev (w/ nodemon)
```bash
$ yarn start
```

### Test
```bash
$ yarn test #or run Test Task in VSCode
```

## DB Stack:
- MongoDB
- ElasticSearch
- Redis (for cache)

## Node Stack:
- [Expressjs](https://github.com/expressjs/express)
- [Passport](https://github.com/jaredhanson/passport)
- [Mongoose](https://github.com/Automattic/mongoose)
- [Nohm](https://github.com/maritz/nohm)
- [Mocha](https://github.com/mochajs/mocha)

- Gulp

### Requests

Activity new table:
- like
- comment

Profile:
- user
- computed stats (spots pics, media, fullclip...)
- media

Spot:
- spot
- computed stats
- media

Embed all `addedBy` and `spot`

Notification model:
- `fromUser` (embeded)
- `toUser` (embeded)
- `type` (like|comment|mention|follow)
- `object` (embeded)