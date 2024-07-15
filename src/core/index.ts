import { container } from "~container";
import { IInitiator } from "~core-types";
import { Tokens } from "~tokens";

const initiator = container.get<IInitiator>(Tokens.Initiator);

export { initiator };
