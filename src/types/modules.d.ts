// Type declarations for modules without types

declare module 'gradient-string' {
  interface Gradient {
    (text: string): string;
    multiline(text: string): string;
  }

  const gradient: {
    rainbow: Gradient;
    [key: string]: Gradient;
  };

  export = gradient;
}

declare module 'chalk-animation' {
  interface ChalkAnimation {
    start(): void;
    stop(): void;
  }

  const chalkAnimation: {
    rainbow(text: string): ChalkAnimation;
    [key: string]: (text: string) => ChalkAnimation;
  };

  export = chalkAnimation;
}
