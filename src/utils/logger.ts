export class Logger {
  static instance: Logger;

  static init() {
    if (!this.instance) {
      this.instance = new Logger();
    }
  }

  static log(...props: any) {
    this.init();
    this.instance.log(...props);
  }

  public log(...props: any) {
    console.log(...props);
  }

  static error(...props: any) {
    this.init();
    this.instance.error(...props);
  }

  public error(...props: any) {
    console.error(...props);
  }

  static warn(...props: any) {
    this.init();
    this.instance.warn(...props);
  }

  public warn(...props: any) {
    console.warn(...props);
  }

  static info(...props: any) {
    this.init();
    this.instance.info(...props);
  }

  public info(...props: any) {
    console.info(...props);
  }
}
