export interface ICreateuser {
    name: string;
    username: string;
    password: string;
}

export interface IUser {
    id: string;
    username: string;
    name: string;
    password: string;
    registeredAt: any;
}

export interface IUpdateUser {
    id: string;
    username: string;
    name: string;
}

export interface ICreateContent {
    comment: string;
    rating: number;
    videoTitle: string;
    videoUrl: string;
    thumbnailUrl: string;
    creatorName: string;
    creatorUrl: string;
    ownerId?: string;
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

export interface IUdateUserName {
    username: string;
    name?: string;
}
