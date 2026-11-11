import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, it, vi } from "vitest";

// next/font/google and next/og only work inside a Next build: the layout needs the CSS variable
// names and the social card needs the element tree it would rasterise.
vi.mock("next/font/google", () => ({
  Instrument_Serif: () => ({ variable: "font-serif-var" }),
  DM_Mono: () => ({ variable: "font-mono-var" }),
}));
vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(
      readonly element: ReactElement,
      readonly init: { width: number; height: number },
    ) {}
  },
}));

import { POST } from "@/app/api/mcp/route";
import RootLayout from "@/app/layout";
import MoreProjects from "@/app/more-projects/page";
import NotFound from "@/app/not-found";
import OpenGraphImage, { alt, contentType, size } from "@/app/opengraph-image";
import Home from "@/app/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";

function mcpCall(body: unknown): Request {
  return new Request("https://example.test/api/mcp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function callListWorks(args: Record<string, unknown>) {
  const response = await POST(mcpCall({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "list_works", arguments: args } }));
  assert.equal(response.status, 200);
  return (await response.json()) as { result?: { content: { text: string }[]; isError?: boolean }; error?: unknown };
}

describe("MCP route", () => {
  it("lists the list_works tool with the gallery views as its enum", async () => {
    const response = await POST(mcpCall({ jsonrpc: "2.0", id: 1, method: "tools/list" }));
    const body = (await response.json()) as { result: { tools: { name: string; inputSchema: { properties: { view: { enum: string[] } } } }[] } };
    assert.deepEqual(body.result.tools.map((tool) => tool.name), ["list_works"]);
    assert.deepEqual(body.result.tools[0].inputSchema.properties.view.enum, ["all", "incoming", "archive"]);
  });

  it("returns the empty registry for the default view", async () => {
    const body = await callListWorks({});
    assert.notEqual(body.result?.isError, true);
    assert.deepEqual(JSON.parse(body.result!.content[0].text), { view: "all", count: 0, works: [] });
  });

  it("accepts a named view", async () => {
    const body = await callListWorks({ view: "archive" });
    assert.equal(JSON.parse(body.result!.content[0].text).view, "archive");
  });

  it("rejects an unknown view and a non-string view as tool errors", async () => {
    for (const view of ["sculpture", 7]) {
      const body = await callListWorks({ view });
      assert.equal(body.result?.isError, true, `view ${String(view)} must be rejected`);
    }
  });
});

describe("pages", () => {
  it("home shows the empty room, every view and the register count", () => {
    const html = renderToString(<Home />);
    assert.match(html, /COLLECTION \/ (<!-- -->)?00(<!-- -->)? WORKS/);
    assert.match(html, /A gallery for images that have not arrived yet\./);
    for (const label of ["All files", "Incoming", "Archive"]) assert.ok(html.includes(label), label);
    assert.equal(html.match(/<main/g)?.length, 1);
  });

  it("more-projects renders one main landmark and links home", () => {
    const html = renderToString(<MoreProjects />);
    assert.equal(html.match(/<main/g)?.length, 1);
    assert.ok(html.includes('href="/"'));
  });

  it("layout sets the language and both font variables on the body", () => {
    const html = renderToString(<RootLayout><main /></RootLayout>);
    assert.ok(html.startsWith('<html lang="en"'));
    assert.ok(html.includes('class="font-serif-var font-mono-var"'));
  });

  it("the skip link is the first element of the body and every page has its target", () => {
    const html = renderToString(<RootLayout><main /></RootLayout>);
    assert.match(html, /<body[^>]*><a class="skip-link" href="#main-content">/);
    for (const page of [<Home key="home" />, <MoreProjects key="more" />, <NotFound key="404" />]) {
      assert.equal(renderToString(page).match(/<main id="main-content"/g)?.length, 1);
    }
  });

  it("not-found links back to the gallery", () => {
    assert.ok(renderToString(<NotFound />).includes('href="/"'));
  });

  it("the social card is 1200x630 PNG and names the gallery", () => {
    assert.deepEqual(size, { width: 1200, height: 630 });
    assert.equal(contentType, "image/png");
    assert.match(alt, /AI Art \/ Gallery/);
    const card = OpenGraphImage() as unknown as { element: ReactElement; init: typeof size };
    assert.deepEqual(card.init, size);
    assert.ok(renderToString(card.element).includes("A gallery in progress"));
  });
});

describe("crawler files", () => {
  it("robots keeps /api/ out and points at the sitemap", () => {
    const rules = robots();
    assert.deepEqual(rules.rules, { userAgent: "*", allow: "/", disallow: "/api/" });
    assert.equal(rules.sitemap, `${SITE_URL}/sitemap.xml`);
  });

  it("sitemap lists home and more-projects on the canonical origin", () => {
    assert.deepEqual(sitemap().map((entry) => entry.url), [SITE_URL, `${SITE_URL}/more-projects`]);
  });

  it("SITE_URL has no trailing slash and honours NEXT_PUBLIC_SITE_URL", async () => {
    assert.ok(!SITE_URL.endsWith("/"));
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://gallery.example.test/");
    try {
      const { SITE_URL: fromEnv } = await import("@/lib/site");
      assert.equal(fromEnv, "https://gallery.example.test");
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
