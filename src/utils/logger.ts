import * as chalk from "chalk";
import * as logSymbols from "log-symbols";

class Logger {
    private removeAndNew: boolean = false;
    private latest: string = "";
    private readonly cls = "\u001B[1F\u001B[2K\u001B[1G";

    public info(msg: string) {
        let log = msg;
        if (this.removeAndNew) {
            log = this.cls + log;
        }
        console.log(logSymbols.info, chalk.cyan(log));
        if (this.removeAndNew) {
            console.log(logSymbols.info, chalk.cyan(this.latest));
        }
    }

    currentInfo(msg: string) {
        this.latest = msg;
        let log = msg;
        if (this.removeAndNew) {
            log = this.cls + log;
        }
        console.log("✨", log);

    }

    cancelCurrent() {
        if (this.removeAndNew) {
            console.log(this.cls);
            this.removeAndNew = false;
        }
    }

    public warning(msg: string) {
        let log = msg;
        if (this.removeAndNew) {
            log = this.cls + log;
        }
        console.log(logSymbols.warning, chalk.yellow(log));
        if (this.removeAndNew) {
            this.info(this.latest);
        }
    }

    public error(err: unknown, further?: string) {
        if (further) {
            console.log(logSymbols.error, chalk.red(further));
        }
        throw err;
    }

    public success(msg: string) {
        let log = msg;
        if (this.removeAndNew) {
            log = this.cls + log;
        }
        console.log(logSymbols.success, chalk.green(log));
        if (this.removeAndNew) {
            this.info(this.latest);
        }
    }
}

const logger = new Logger();
export default logger;