# Pieces Of A Woman Bible Studies

## Shared stylesheet versions

After editing either shared stylesheet, run:

```sh
python3 tools/sync_stylesheets.py
```

This derives one cache version from the contents of `css/navbar.css` and
`css/satin.css`, then updates both stylesheet links on every themed HTML page.
There is no manually maintained version on each page. The standalone landing
pages use their own inline styles and are left unchanged.

Before committing, verify the links with:

```sh
python3 tools/sync_stylesheets.py --check
```

The same check runs on pushes and pull requests. Commit the updated HTML links
together with CSS changes; an outdated version causes the check to fail.
