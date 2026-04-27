// TODO(auth): replace with real session lookup
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export function getCurrentUser(): CurrentUser {
  return {
    id: "stub-user",
    name: "MJ Newland",
    email: "mj@example.com",
    avatarUrl: null,
  };
}
