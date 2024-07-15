import type {IAbstractConnector} from "./abstract.connector";
import type {Mongoose} from "~packages-types";

export interface IMongoConnector extends IAbstractConnector {
    readonly connection: Mongoose.Mongoos
}