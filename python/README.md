# Context Nine Vault TUI

Textual control room for `vault` commands.

```bash
uv run vault-tui --vault-root "$(vault root)"
```

The TUI reads `_master/system/scripts/vault-commands.json` from the vault root and executes `vault` subcommands through argument arrays.

