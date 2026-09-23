# Release provenance

An exact version tag builds and tests the plugin before GitHub publishes
`main.js`, `manifest.json`, and `styles.css`. The release also contains a JSON
record with the full source commit and a SHA-256 checksum file for all three
plugin assets. GitHub attests the assets, record, and checksum file together.

The tag must equal the version in `manifest.json`. Verify a downloaded release
with the checksum file, then compare `source_commit` in the release record with
the tag's commit.
