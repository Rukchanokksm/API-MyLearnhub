import {
  IContent,
  ICreateContent,
  ICreateuser,
  IUpdateContent,
  Iuser,
} from "../entity";

export interface IRepositoryContent {
  createContent(arg: ICreateContent): Promise<IContent>;
  getContentById(id: number): Promise<IContent>;
  getContents(): Promise<IContent[]>;
  updateContentById(arg: IUpdateContent): Promise<IContent>;
  deleteContentById(id: number): Promise<IContent>;
}

export interface IRepositoryUser {
  createUser(user: ICreateuser): Promise<Iuser>;
  getUser(username: string): Promise<Iuser | null>;
}
