import { AbilityBuilder, PureAbility, AbilityClass } from "@casl/ability";
import { IUser } from "./middleware";

type AppAbility = PureAbility<[string, string]>;

function getActionFromMethod(method: string): string | null {
  switch (method) {
    case "GET":
      return "read";
    case "POST":
      return "create";
    case "PUT":
    case "PATCH":
      return "update";
    case "DELETE":
      return "delete";
    default:
      return null;
  }
}

function getSubjectFromPath(path: string): string | null {
  const match = path.match(/^\/api\/(\w+)/);
  return match ? match[1] : null;
}

function defineAbilitiesFor(user: IUser): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<
    PureAbility<[string, string]>
  >(PureAbility as AbilityClass<AppAbility>);

  user.permissions.forEach(({ action, subject }) => {
    can(action, subject);
  });

  return build({
    detectSubjectType: (object) => object as string,
  });
}

export function checkPermission(
  method: string,
  path: string,
  user: IUser
): boolean {
  const action = getActionFromMethod(method);
  const subject = getSubjectFromPath(path);

  if (!action || !subject) {
    return false;
  }

  const ability = defineAbilitiesFor(user);
  return ability.can(action, subject);
}
