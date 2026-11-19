import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, it, vi } from "vitest";

// next/font/google and next/og only work inside a Next build: the layout needs the CSS variable
// names and the social card needs the element tree it would rasterise.
vi.mock("next/font/google", () => ({ Geist: () => ({ variable: "font-geist-var" }) }));
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
import NotFound from "@/app/not-found";
import OpenGraphImage, { alt, contentType, size } from "@/app/opengraph-image";
import Home from "@/app/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL, SOURCE_URL } from "@/lib/site";
import nextConfig from "@/next.config";

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
  it("home is on the Reader shell: one h1, the empty room with a way on, hub and source links", () => {
    const html = renderToString(<Home />);
    assert.equal(html.match(/<h1/g)?.length, 1);
    assert.match(html, /A gallery waiting for its first work/);
    assert.match(html, /No works on file yet/);
    assert.ok(html.includes('class="rs-button" href="https://bookchaowalit.com/"'));
    assert.ok(html.includes(`href="${SOURCE_URL}"`));
    assert.ok(!html.includes("bookchaowalit-ai-art-gallery-frontend"));
    assert.ok(!/AUG 2026/.test(html));
    assert.equal(html.match(/<main id="main"/g)?.length, 1);
  });

  it("layout puts the Geist variable on <html>", () => {
    const html = renderToString(<RootLayout><main /></RootLayout>);
    assert.ok(html.startsWith('<html lang="en" class="font-geist-var"'));
  });

  it("not-found keeps the top bar and footer and links back to the gallery", () => {
    const html = renderToString(<NotFound />);
    assert.ok(html.includes('class="rs-top"'));
    assert.ok(html.includes('class="rs-foot"'));
    assert.ok(html.includes('href="/"'));
    assert.equal(html.match(/<h1/g)?.length, 1);
  });

  it("/more-projects redirects to the portfolio hub for good", async () => {
    const redirects = await nextConfig.redirects!();
    assert.deepEqual(redirects, [{ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true }]);
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

  it("sitemap lists home on the canonical origin, which defaults to the site's own domain", () => {
    assert.deepEqual(sitemap().map((entry) => entry.url), [SITE_URL]);
    assert.equal(SITE_URL, "https://ai-art-gallery.bookchaowalit.com");
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
