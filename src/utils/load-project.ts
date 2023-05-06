import Project from "../types/project";
import * as fs from "fs";

export default function loadProject(): Project {
    let written: any = {};
    let hasConfig = false;
    try {
        written = JSON.parse(fs.readFileSync(process.cwd() + "/npd.json").toString());
        hasConfig = true;
    } catch {
    }

    let project: Project = { ...defaultConfig, ...written };
    project.test = { ...defaultConfig.test, ...written.test };
    project.build = { ...defaultConfig.build, ...written.build };
    project.publish = { ...defaultConfig.publish, ...written.publish };
    // project.userScripts = { ...defaultConfig.userScripts, ...written.userScripts };
    project.current = defaultConfig.current;
    project.current.hasConfig = hasConfig;

    if (!project.publish.gitTag) {
        project.test.gitTag = false;
    }

    return project;
}

function isGitRepo(): boolean {
    try {
        fs.accessSync(".git");
        return true;
    } catch (error) {
        return false;
    }
}

function getPackageJson() {
    let packageJson = { exist: false };
    try {
        packageJson = JSON.parse(fs.readFileSync("package.json").toString());
        packageJson.exist = true;
    } catch {
    }
    return packageJson;
}

const current = {
    hasConfig: false,
    isGitRepo: isGitRepo(),
    packageJson: getPackageJson(),
    shell: process.platform == "win32"
};

const defaultConfig: Project = {
    test: {
        gitTag: current.isGitRepo,
        npm: true,
        npmIgnore: true,
        projectScripts: true
    },
    build: {
        projectScripts: true
    },
    publish: {
        pretest: true,
        prebuild: true,
        gitTag: {
            use: true,
            push: true,
            ignoreError: false,
            origins: ["origin"],
            output: false
        },
        npm: {
            use: true,
            changeRegistry: true
        },
        projectScripts: true
    },
    ignoreError: false,
    current: {
        hasConfig: current.hasConfig,
        isGitRepo: current.isGitRepo,
        packageJson: current.packageJson,
        shell: current.shell
    }
};