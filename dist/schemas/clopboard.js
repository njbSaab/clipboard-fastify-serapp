"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClipboardSchema = exports.toggleFavoriteSchema = exports.createClipboardSchema = void 0;
exports.createClipboardSchema = {
    body: {
        type: 'object',
        required: ['content'],
        properties: {
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
exports.deleteClipboardSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
};
//# sourceMappingURL=clopboard.js.map