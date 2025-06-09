export const createClipboardSchema = {
    body: {
      type: 'object',
      required: ['content'],
      properties: {
        content: { type: 'string', minLength: 1 },
      },
    },
  };
  
  export const toggleFavoriteSchema = {
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
  
  export const deleteClipboardSchema = {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  };
  