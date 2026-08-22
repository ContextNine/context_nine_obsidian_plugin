import { describe, expect, it } from "vitest";
import { parseVaultCommandMetadata } from "../src/vault-command-metadata";

describe("vault command metadata", () => {
  it("keeps legacy command metadata compatible", () => {
    const result = parseVaultCommandMetadata(
      JSON.stringify([
        {
          id: "refresh",
          label: "Refresh",
          description: "Run refresh",
          args: ["refresh"],
        },
      ])
    );

    expect(result.warning).toBeUndefined();
    expect(result.commands[0]).toMatchObject({
      id: "refresh",
      palette: undefined,
      promptArgs: undefined,
    });
  });

  it("parses palette flags, prompt args, and v2 tui metadata", () => {
    const result = parseVaultCommandMetadata(
      JSON.stringify([
        {
          id: "folder-register",
          label: "Folder Register",
          description: "Register a folder",
          args: ["folder", "register"],
          cockpit: false,
          palette: true,
          group: "Folders",
          risk: "apply",
          tui: true,
          mode: "run",
          confirm: true,
          statusArgs: ["inventory", "--json"],
          promptArgs: [
            {
              label: "Context folder",
              placeholder: "impression",
              argName: "name",
              type: "choice",
              choices: ["impression.nosync", "personal"],
            },
          ],
        },
      ])
    );

    expect(result.warning).toBeUndefined();
    expect(result.commands[0]).toMatchObject({
      cockpit: false,
      palette: true,
      group: "Folders",
      risk: "apply",
      tui: true,
      mode: "run",
      confirm: true,
      statusArgs: ["inventory", "--json"],
      promptArgs: [
        {
          label: "Context folder",
          placeholder: "impression",
          argName: "name",
          type: "choice",
          choices: ["impression.nosync", "personal"],
        },
      ],
    });
  });

  it("rejects malformed prompt args", () => {
    const result = parseVaultCommandMetadata(
      JSON.stringify([
        {
          id: "folder-register",
          label: "Folder Register",
          description: "Register a folder",
          args: ["folder", "register"],
          promptArgs: [{ placeholder: "impression" }],
        },
      ])
    );

    expect(result.warning).toContain("invalid command");
  });
});
