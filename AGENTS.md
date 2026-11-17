# Architecture rules

- Keep SQL migrations out of client imports; use the internal country JSON snapshot for existing catalog fallbacks so browser compilers never parse SQL as JavaScript.