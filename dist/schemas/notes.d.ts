export declare const createNoteSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            title: {
                type: string;
                minLength: number;
            };
            content: {
                type: string;
                minLength: number;
            };
        };
    };
};
export declare const toggleFavoriteSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            favorite: {
                type: string;
            };
        };
    };
    params: {
        type: string;
        required: string[];
        properties: {
            id: {
                type: string;
                format: string;
            };
        };
    };
};
export declare const deleteNoteSchema: {
    params: {
        type: string;
        required: string[];
        properties: {
            id: {
                type: string;
                format: string;
            };
        };
    };
};
