export interface ICreateuser {
    name: string;
    username: string;
    password: string;
}

export interface Iuser {
    id: string;
    username: string;
    password: string;
    registed?: number;
}

export interface ICreateContent {
    ownerId: string;
    comment: string;
    rating: number;
    videoTitle: string;
    videoUrl: string;
    thumbnailUrl: string;
    creatorName: string;
    creatorUrl: string;
}

export interface IContent {
    id: number;
    videoUrl: string;
    comment: string;
    rating: number;
    ownerId: string;
}

export interface IUpdateContent {
    ownerId: number;
    comment: string;
    rating: number;
}
