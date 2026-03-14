import { NextRequest, NextResponse } from "next/server";
import { proxy } from "@/proxy";

// Helper to build a mock NextRequest
function makeRequest(pathname: string, sessionCookie?: string): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const headers = new Headers();
  if (sessionCookie) {
    headers.set("cookie", `__session=${sessionCookie}`);
  }
  return new NextRequest(url, { headers });
}

// ─── Unauthenticated ──────────────────────────────────────────────────────────

describe("middleware — unauthenticated user", () => {
  it("redirects /board to /login", () => {
    const req = makeRequest("/board");
    const res = proxy(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("passes /login through", () => {
    const req = makeRequest("/login");
    const res = proxy(req);
    expect(res.headers.get("location")).toBeNull();
  });

  it("passes /register through", () => {
    const req = makeRequest("/register");
    const res = proxy(req);
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects / to /board then /board to /login", () => {
    const req = makeRequest("/");
    const res = proxy(req);
    // / is not in middleware matcher directly — passes through (page.tsx handles it)
    expect(res.headers.get("location")).toBeNull();
  });

  it("appends redirect param when blocking /board", () => {
    const req = makeRequest("/board");
    const res = proxy(req);
    expect(res.headers.get("location")).toContain("redirect=%2Fboard");
  });
});

// ─── Authenticated ────────────────────────────────────────────────────────────

describe("middleware — authenticated user", () => {
  it("passes /board through", () => {
    const req = makeRequest("/board", "uid-123");
    const res = proxy(req);
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects /login to /board", () => {
    const req = makeRequest("/login", "uid-123");
    const res = proxy(req);
    expect(res.headers.get("location")).toContain("/board");
  });

  it("redirects /register to /board", () => {
    const req = makeRequest("/register", "uid-123");
    const res = proxy(req);
    expect(res.headers.get("location")).toContain("/board");
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe("proxy — edge cases", () => {
  it("treats empty __session cookie as unauthenticated", () => {
    const req = makeRequest("/board", "");
    const res = proxy(req);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("handles nested board routes e.g. /board/123", () => {
    const req = makeRequest("/board/123");
    const res = proxy(req);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("authenticated user can access nested /board/123", () => {
    const req = makeRequest("/board/123", "uid-123");
    const res = proxy(req);
    expect(res.headers.get("location")).toBeNull();
  });
});