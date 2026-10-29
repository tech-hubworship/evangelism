export function jsonError(
  message: string,
  status = 500,
  extra?: Record<string, unknown>
) {
  return Response.json({ error: message, ...(extra ?? {}) }, { status });
}

export function jsonOk<T>(data: T, status = 200, headers?: HeadersInit) {
  return Response.json(data, { status, headers });
}

export function methodNotAllowed(allowed?: string[]) {
  return Response.json(
    { error: "Method not allowed" },
    {
      status: 405,
      headers: allowed ? { Allow: allowed.join(", ") } : undefined,
    }
  );
}
