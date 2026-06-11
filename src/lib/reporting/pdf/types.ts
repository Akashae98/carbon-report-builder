export interface BrowserResponseAdapter {
  status(): number;
  url(): string;
}

export interface BrowserPageAdapter {
  emulateMediaType(type: "print" | "screen"): Promise<void>;
  goto(
    url: string,
    options: { waitUntil: "networkidle0"; timeout: number },
  ): Promise<BrowserResponseAdapter | null>;
  setExtraHTTPHeaders(headers: Record<string, string>): Promise<void>;
  title(): Promise<string>;
  url(): string;
  evaluate<T>(pageFunction: () => Promise<T>): Promise<T>;
  waitForSelector(selector: string, options: { timeout: number }): Promise<unknown>;
  pdf(options: {
    format: "A4";
    printBackground: boolean;
    preferCSSPageSize: boolean;
  }): Promise<Uint8Array>;
}

export interface BrowserAdapter {
  newPage(): Promise<BrowserPageAdapter>;
  close(): Promise<void>;
}
