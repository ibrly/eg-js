import { NAVIGATION } from "@/config/navigation";

export function isItemActive(href: string, pathname: string): boolean {
  if (pathname === href) return true;
  if (href === "/") return false;
  return pathname.startsWith(href + "/");
}

export function findActiveGroupAndBranch(
  pathname: string,
): { groupId?: string; branchId?: string } {
  let bestLength = -1;
  let groupId: string | undefined;
  let branchId: string | undefined;

  for (const group of NAVIGATION) {
    for (const item of group.items) {
      if (item.kind === "leaf") {
        if (isItemActive(item.href, pathname) && item.href.length > bestLength) {
          bestLength = item.href.length;
          groupId = group.id;
          branchId = undefined;
        }
      } else {
        for (const child of item.children) {
          if (isItemActive(child.href, pathname) && child.href.length > bestLength) {
            bestLength = child.href.length;
            groupId = group.id;
            branchId = item.id;
          }
        }
      }
    }
  }

  return bestLength === -1 ? {} : { groupId, branchId };
}
