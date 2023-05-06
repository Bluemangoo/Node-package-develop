import * as chalk from "chalk";
import * as logSymbols from "log-symbols";
import Project from "../types/project";

class Logger {
    private removeAndNew: boolean = false;
    private latest: string = "";
    private readonly cls = "\u001B[1F\u001B[2K\u001B[1G";

    public info(msg: string) {
        let prefix = "";
        if (this.removeAndNew) {
            prefix = this.cls;
        }
        console.log(prefix, logSymbols.info, chalk.cyan(msg));
        if (this.removeAndNew) {
            console.log(logSymbols.info, chalk.cyan(this.latest));
        }
    }

    currentInfo(msg: string) {
        this.latest = msg;
        let prefix = "";
        if (this.removeAndNew) {
            prefix = this.cls;
        }
        console.log(prefix, "✨", msg);

    }

    cancelCurrent() {
        if (this.removeAndNew) {
            console.log(this.cls);
            this.removeAndNew = false;
        }
    }

    public warn(msg: string) {
        let prefix = "";
        if (this.removeAndNew) {
            prefix = this.cls;
        }
        console.warn(prefix, logSymbols.warning, chalk.yellow(msg));
        if (this.removeAndNew) {
            this.info(this.latest);
        }
    }

    public throwOrWarn(ignoreError: boolean, err: unknown, further?: string) {
        if (ignoreError) {
            let prefix = "";

            if (this.removeAndNew) {
                prefix = this.cls;
            }

            if (further) {
                console.warn(prefix, logSymbols.warning, chalk.yellow(further));
                console.warn(err);
            } else {
                console.warn(prefix, err);
            }

            if (this.removeAndNew) {
                this.info(this.latest);
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
        let prefix = "";
        if (this.removeAndNew) {
            prefix = this.cls;
        }
        console.log(prefix, logSymbols.success, chalk.green(msg));
        if (this.removeAndNew) {
            this.info(this.latest);
        }
    }
}

const logger = new Logger();
export default logger;