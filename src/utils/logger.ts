import * as chalk from "chalk";
import * as logSymbols from "log-symbols";

class Logger {
    private removeAndNew: boolean = false;
    private latest: string = "";
    private readonly cls = "\u001B[F\u001B[2K";
    private readonly stream: NodeJS.WriteStream = process.stdout;

    private clearLine() {
        this.stream.write(this.cls);
    }

    private writeLine(message?: any, ...optionalParams: any[]) {
        this.stream.write(Buffer.from([message, ...optionalParams].join(" ") + "\n"));
    }

    public info(msg: string) {
        if (this.removeAndNew) {
            this.clearLine();
        }
        console.log(logSymbols.info, chalk.cyan(msg));
        if (this.removeAndNew) {
            this.reWriteCurrent();
        }
    }

    currentInfo(msg: string) {
        this.latest = msg;
        if (this.removeAndNew) {
            this.clearLine();
        }
        this.removeAndNew = true;
        this.writeLine("✨", msg);
    }

    private reWriteCurrent() {
        this.writeLine("✨", this.latest);
    }

    cancelCurrent() {
        if (this.removeAndNew) {
            this.clearLine();
            this.removeAndNew = false;
        }
    }

    public warn(msg: string) {
        if (this.removeAndNew) {
            this.clearLine();
        }
        console.warn(logSymbols.warning, chalk.yellow(msg));
        if (this.removeAndNew) {
            this.reWriteCurrent();
        }
    }

    public throwOrWarn(ignoreError: boolean, err: unknown, further?: string) {
        if (ignoreError) {
            if (this.removeAndNew) {
                this.clearLine();
            }
            if (further) {
                console.warn(logSymbols.warning, chalk.yellow(further));
            }
            console.warn(err);

            if (this.removeAndNew) {
                this.reWriteCurrent();
            }
        } else {
            this.error(err, further);
        }
    }

    public error(err: unknown, further?: string) {
        if (further) {
            console.log(logSymbols.error, chalk.red(further));
        }
        throw err;
    }

    public success(msg: string) {
        if (this.removeAndNew) {
            this.clearLine();
        }
        this.writeLine(logSymbols.success, chalk.green(msg));
        if (this.removeAndNew) {
            this.reWriteCurrent();
        }
    }
}

const logger = new Logger();
export default logger;