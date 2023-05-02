export default interface Project {
    test: {
        gitTag: boolean,
        npm: boolean,
        npmIgnore: boolean,
        projectScripts: boolean,
        userScripts: boolean
    },
    build: {
        projectScripts: boolean,
        userScripts: boolean
    },
    publish: {
        pretest: boolean,
        prebuild: boolean,
        gitTag: boolean,
        pushGitTag: boolean,
        npm: boolean,
        changeRegistry: boolean,
        projectScripts: boolean,
        userScripts: boolean
    },
    // userScripts: { [key: string]: string },
    current: {
        hasConfig: boolean,
        isGitRepo: boolean,
        packageJson: { exist: boolean, name?: string, version?: string, scripts?: { [key: string]: string } }
    }
};