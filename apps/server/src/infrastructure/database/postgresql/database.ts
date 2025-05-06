import { injectable } from "inversify";
import { PrismaClient } from "./generated/prisma";

@injectable()
export class PostgresDatabase extends PrismaClient {}
