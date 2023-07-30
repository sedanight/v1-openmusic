/* eslint-disable no-underscore-dangle */
const { successResponse } = require('../../utils/responseHandler');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const _albumId = await this._service.addAlbum(request.payload);

    return successResponse(h, {
      message: 'Album berhasil ditambahkan',
      data: {
        albumId: _albumId,
      },
      responseCode: 201,
    });
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const _songs = await this._service.getSongsByAlbumId(id);
    const _album = await this._service.getAlbumById(id);

    return successResponse(h, {
      data: {
        album: {
          id: _album.id,
          name: _album.name,
          year: _album.year,
          coverUrl: _album.cover,
          songs: _songs,
        },
      },
    });
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.updateAlbumById(id, request.payload);

    return successResponse(h, {
      message: 'Detail album berhasil diperbarui',
    });
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return successResponse(h, {
      message: 'Album berhasil dihapus',
    });
  }
}

module.exports = AlbumsHandler;
