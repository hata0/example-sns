import { Container } from "inversify";
import { PostPostgresRepository } from "../repositories/post-postgres-repository";
import { PostPostgresQueryService } from "../queries/post-postgres-service";
import { PostgresDatabase } from "@/db/postgresql";
import type { PostRepository } from "@/domain/repositories/post-repository";
import {
  APPLICATION_SERVICE_BINDINGS,
  COMMAND_CONTROLLER_BINDINGS,
  DATABASE_BINDINGS,
  QUERY_CONTROLLER_BINDINGS,
  QUERY_SERVICE_BINDINGS,
  REPOSITORY_BINDINGS,
} from "@/inversify";
import { PostApplicationService } from "@/application/commands/post-service";
import type { PostQueryService } from "@/application/queries/post-service";
import { PostQueryController } from "@/interface/controllers/queries/post-query-controller";
import { PostCommandController } from "@/interface/controllers/commands/post-command-controller";

const bindDatabases = (container: Container) => {
  container
    .bind<PostgresDatabase>(DATABASE_BINDINGS.PostgresDatabase)
    .to(PostgresDatabase);
};

const bindRepositories = (container: Container) => {
  container
    .bind<PostRepository>(REPOSITORY_BINDINGS.PostRepository)
    .to(PostPostgresRepository);
};

const bindApplicationServices = (container: Container) => {
  container
    .bind<PostApplicationService>(
      APPLICATION_SERVICE_BINDINGS.PostApplicationService,
    )
    .to(PostApplicationService);
};

const bindCommandController = (container: Container) => {
  container
    .bind<PostCommandController>(
      COMMAND_CONTROLLER_BINDINGS.PostCommandController,
    )
    .to(PostCommandController);
};

const bindQueryServices = (container: Container) => {
  container
    .bind<PostQueryService>(QUERY_SERVICE_BINDINGS.PostQueryService)
    .to(PostPostgresQueryService);
};

const bindQueryControllers = (container: Container) => {
  container
    .bind<PostQueryController>(QUERY_CONTROLLER_BINDINGS.PostQueryController)
    .to(PostQueryController);
};

export const createContainer = (): Container => {
  const container = new Container();

  bindDatabases(container);
  bindRepositories(container);
  bindApplicationServices(container);
  bindCommandController(container);
  bindQueryServices(container);
  bindQueryControllers(container);

  return container;
};
