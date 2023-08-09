import {
    IContent,
    ICreateContent,
    ICreateuser,
    IUdateUserName,
    IUpdateContent,
    IUser,
} from "../entity";

export interface IRepositoryContent {
    createContent(arg: ICreateContent): Promise<IContent>;
    getContentById(id: number): Promise<IContent | null>;
    getContents(): Promise<IContent[]>;
    updateContentById(arg: IUpdateContent): Promise<IContent>;
    deleteContentById(id: number): Promise<IContent>;
}

export interface IRepositoryUser {
    createUser(user: ICreateuser): Promise<IUser>;
    getUser(username: string): Promise<IUser | null>;
    upDateUsername(arg: IUdateUserName): Promise<IUser>;
}

export interface IRepositoryBlacklist {
    addToBlacklist(token: string): Promise<void>;
    isBlacklisted(token: string): Promise<boolean>;
}
