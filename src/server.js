require('dotenv').config();

const Hapi = require('@hapi/hapi');

const ClientError = require('./exceptions/ClientError');
const {
  failResponse,
  serverErrorResponse,
} = require('./utils/responseHandler');

// albums
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album');

// song
const songs = require('./api/songs');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof ClientError) {
      return failResponse(h, response);
    } if (response instanceof Error) {
      const { statusCode, payload } = response.output;
      switch (statusCode) {
        case 400:
          return h.response(payload).code(400);
        case 401:
          return h.response(payload).code(401);
        case 404:
          return h.response(payload).code(404);
        case 413:
          return h.response(payload).code(413);
        case 415:
          return h.response(payload).code(415);
        default:
          return serverErrorResponse(h);
      }
    }

    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
