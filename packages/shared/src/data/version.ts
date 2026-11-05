/**
 * 判断服务端数据版本是否与当前版本不同。
 * - 任一为空时返回 false（首次加载或旧数据不提示）；
 * - 版本不同即提示，兼容数据回滚场景。
 */
export function isDataVersionNewer(
  current: string | null | undefined,
  incoming: string | null | undefined,
): boolean {
  if (!incoming || !current) return false;
  return incoming !== current;
}
