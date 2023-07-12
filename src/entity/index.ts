export interface ICreateuser {
    name: string;
    username: string;
    password: string;
}

export interface Iuser {
    id: string;
    username: string;
    name: string;
    password: string;
    registeredAt: any;
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

export interface IContent extends ICreateContent {
    id: number;
}

export interface IUpdateContent {
    id: number;
    ownerId: string;
    comment?: string;
    rating?: number;
}
