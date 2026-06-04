/** Slash command dispatcher. */
import { appState } from "../state/store";
import { openSession } from "../api/invoke";
import { handleModelCommand, type CommandResult } from "./model";
import { handleReasoningCommand } from "./reasoning";

/** Build a structured diagnostic briefing prompt from /diagnose args. */
function handleDiagnoseCommand(args: string): CommandResult {
  const trimmed = args.trim();

  if (!trimmed) {
    // No args — show the briefing template for the user to fill in
    return {
      action: "handled",
      lines: [
        "DIAGNOSTIC BRIEFING",
        "───────────────────",
        "Describe your machine problem. Structure it like this:",
        "",
        "  /diagnose Symptom: [what's going wrong?]",
        "  System: [OS, machine type, or affected component]",
        "  Since: [when did it start?]",
        "  Tried: [what have you already tried?]",
        "",
        "Or just: /diagnose [symptom] — and the team will triage it.",
      ],
    };
  }

  // Parse structured fields if present
  const symptomMatch = trimmed.match(/symptom:\s*(.+?)(?=\s*(?:system:|since:|tried:|$))/i);
  const systemMatch = trimmed.match(/system:\s*(.+?)(?=\s*(?:since:|tried:|$))/i);
  const sinceMatch = trimmed.match(/since:\s*(.+?)(?=\s*(?:tried:|$))/i);
  const triedMatch = trimmed.match(/tried:\s*(.+)/i);

  let briefing: string;

  if (symptomMatch) {
    // Structured briefing
    const parts = [`DIAGNOSTIC BRIEFING\nSymptom: ${symptomMatch[1].trim()}`];
    if (systemMatch) parts.push(`System: ${systemMatch[1].trim()}`);
    if (sinceMatch) parts.push(`Since: ${sinceMatch[1].trim()}`);
    if (triedMatch) parts.push(`Already tried: ${triedMatch[1].trim()}`);
    parts.push("\nDeploy the diagnostic team. Start with a triage plan, assign specialists, and begin investigating.");
    briefing = parts.join("\n");
  } else {
    // Quick briefing — just a symptom description
    briefing = [
      `DIAGNOSTIC BRIEFING`,
      `Symptom: ${trimmed}`,
      ``,
      `Open a diagnostic case on this issue. Triage the problem, assign specialist roles,`,
      `and begin the investigation. Ask me clarifying questions if needed.`,
    ].join("\n");
  }

  return {
    action: "send",
    lines: [`Diagnostic case opened: ${symptomMatch ? symptomMatch[1].trim() : trimmed}`],
    sendText: briefing,
  };
}

/** Dispatch a slash command. Returns null if not a slash command. */
export async function dispatchSlashCommand(input: string): Promise<CommandResult | null> {
  const trimmed = input.trim();
  if (!trimmed.startsWith("/")) return null;

  const spaceIdx = trimmed.indexOf(" ");
  const cmd = spaceIdx === -1 ? trimmed.toLowerCase() : trimmed.slice(0, spaceIdx).toLowerCase();
  const args = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1);

  switch (cmd) {
    case "/help":
      return {
        action: "handled",
        lines: [
          "Available commands:",
          "  /help               Show this help",
          "  /new                Start a new session",
          "  /clear              Clear chat messages",
          "  /quit, /exit        Quit the application",
          "  /status             Show current status",
          "  /model              Show/switch model (aliases: opus, sonnet, haiku, gpt5, ...)",
          "  /model <name>       Switch model (auto-detects provider)",
          "  /model <name> --save  Switch and persist",
          "  /model list [provider]  List available models",
          "  /reasoning          Show/set reasoning effort",
          "  /reasoning <level>  Set level (low, medium, high, off)",
          "  /diagnose           Open a diagnostic briefing (disk-doctor mode)",
          "  /diagnose <symptom> Quick-brief a machine investigation",
        ],
      };

    case "/new": {
      try {
        const session = await openSession();
        appState.update((s) => ({
          ...s,
          sessionId: session.id,
          messages: [],
          inputTokens: 0,
          outputTokens: 0,
          currentStep: 0,
          currentDepth: 0,
          inputQueue: [],
        }));
        window.dispatchEvent(new CustomEvent("session-changed", { detail: { isNew: true } }));
        return {
          action: "handled",
          lines: [`New session: ${session.id.slice(0, 8)}`],
        };
      } catch (e) {
        return {
          action: "handled",
          lines: [`Failed to create session: ${e}`],
        };
      }
    }

    case "/clear":
      return { action: "clear", lines: [] };

    case "/quit":
    case "/exit":
      return { action: "quit", lines: ["Goodbye."] };

    case "/status": {
      const s = appState.get();
      const inK = (s.inputTokens / 1000).toFixed(1);
      const outK = (s.outputTokens / 1000).toFixed(1);
      return {
        action: "handled",
        lines: [
          `Provider:    ${s.provider || "auto"}`,
          `Model:       ${s.model || "—"}`,
          `Reasoning:   ${s.reasoningEffort ?? "off"}`,
          `Mode:        ${s.recursive ? "recursive" : "flat"}`,
          `Max depth:   ${s.maxDepth}`,
          `Max steps:   ${s.maxStepsPerCall}`,
          `Workspace:   ${s.workspace || "."}`,
          `Session:     ${s.sessionId ? s.sessionId.slice(0, 8) : "—"}`,
          `Tokens:      ${inK}k in / ${outK}k out`,
          `Running:     ${s.isRunning ? "yes" : "no"}`,
          `Queue:       ${s.inputQueue.length} item(s)`,
        ],
      };
    }

    case "/model":
      return handleModelCommand(args);

    case "/reasoning":
      return handleReasoningCommand(args);

    case "/diagnose":
      return handleDiagnoseCommand(args);

    default:
      return {
        action: "handled",
        lines: [`Unknown command: ${cmd}. Type /help for available commands.`],
      };
  }
}
