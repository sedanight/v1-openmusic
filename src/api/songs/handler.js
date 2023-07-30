/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
const { successResponse } = require('../../utils/responseHandler');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const _songId = await this._service.addSong(request.payload);

    return successResponse(h, {
      message: 'Lagu berhasil ditambahkann',
      data: {
        songId: _songId,
      },
      responseCode: 201,
    });
  }

  async getSongsHandler(request, h) {
    const { title = '', performer = '' } = request.query;
    const songs = await this._service.getSongs();

    return successResponse(h, {
      data: {
        songs: songs.filter(
          (song) => (song.title.toLowerCase().includes(title.toLowerCase())
              && song.performer.toLowerCase().includes(performer.toLowerCase())),
        ).map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    });
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    song.year = parseInt(song.year);
    song.duration = parseInt(song.duration);
    return successResponse(h, {
      data: {
        song,
      },
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.updateSongById(id, request.payload);

    return successResponse(h, {
      message: 'Detail lagu berhasil diperbarui',
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return successResponse(h, {
      message: 'Lagu berhasil dihapus',
    });
  }
}

module.exports = SongHandler;
