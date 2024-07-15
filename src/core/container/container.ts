import "reflect-metadata";
import { inversify } from "~packages";

const mode = process.env.OFMS_LTD_PROFILE ?? "default";
const modulePath = `./core.${mode}.ioc.module`;

const { Module } = require(modulePath);

const container = new inversify.Container();
container.load(Module);

export { container };
