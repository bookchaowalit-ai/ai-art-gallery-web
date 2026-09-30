import { WORKS } from "@/data/works";
import { VIEWS, exhibitableWorks, filterWorks } from "@/lib/gallery";
import type { ViewId } from "@/lib/gallery";
import { ToolInputError, optionalString, respondToMcpRequest } from "@/lib/mcp";
import type { McpTool } from "@/lib/mcp";

const SERVER = { name: "bookchaowalit-ai-art-gallery", version: "0.2.0" };
const VIEW_IDS = VIEWS.map((view) => view.id) as string[];

const TOOLS: McpTool[] = [
  {
    name: "list_works",
    description:
      "List verified works in the gallery registry (optionally filtered by view: all, incoming, archive). Returns an empty list while no work is on file.",
    inputSchema: {
      type: "object",
      properties: { view: { type: "string", enum: VIEW_IDS } },
    },
    handler: (args) => {
      const view = optionalString(args, "view") ?? "all";
      if (!VIEW_IDS.includes(view)) throw new ToolInputError(`Unknown view "${view}".`);
      const works = filterWorks(exhibitableWorks(WORKS), view as ViewId);
      return { view, count: works.length, works };
    },
  },
];

export async function POST(request: Request) {
  return respondToMcpRequest(request, SERVER, TOOLS);
}
