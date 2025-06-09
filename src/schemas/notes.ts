export const createNoteSchema = {
    body: {
      type: 'object',
      required: ['title', 'content'],
      properties: {
        title: { type: 'string', minLength: 1 },
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
  
  export const deleteNoteSchema = {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  };