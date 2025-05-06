export const DATABASE_BINDINGS = {
  PostgresDatabase: Symbol.for("PostgresDatabase"),
};

export const REPOSITORY_BINDINGS = {
  PostRepository: Symbol.for("PostRepository"),
};

export const APPLICATION_SERVICE_BINDINGS = {
  PostApplicationService: Symbol.for("PostApplicationService"),
};

export const COMMAND_CONTROLLER_BINDINGS = {
  PostCommandController: Symbol.for("PostCommandController"),
};

export const QUERY_SERVICE_BINDINGS = {
  PostQueryService: Symbol.for("PostQueryService"),
};

export const QUERY_CONTROLLER_BINDINGS = {
  PostQueryController: Symbol.for("PostQueryController"),
};
