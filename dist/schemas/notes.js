"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNoteSchema = exports.toggleFavoriteSchema = exports.createNoteSchema = void 0;
exports.createNoteSchema = {
    body: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
            title: { type: 'string', minLength: 1 },
            content: { type: 'string', minLength: 1 },
        },
    },
};
exports.toggleFavoriteSchema = {
    body: {
        type: 'object',
        required: ['favorite'],
        properties: {
            favorite: { type: 'boolean' },
        },
    },
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
};
exports.deleteNoteSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
};
//# sourceMappingURL=notes.js.map