interface ImportMetaEnv {
  /** "false" for a launch build; anything else (or unset) builds the noindex preview. */
  readonly PUBLIC_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
