export declare const createClipboardSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
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
export declare const deleteClipboardSchema: {
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
