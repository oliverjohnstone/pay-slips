const CMD_GOTO = 'goTo';
const CMD_ENTER_TEXT = 'enterText';
const CMD_CLICK_AND_WAIT = 'clickAndWaitFor';

const TOKENS = {
    USER_NAME: '{{USER_NAME}}',
    PASSWORD: '{{PASSWORD}}'
};

class Commands {
    constructor(commands, replacementTokens) {
        this.cmd = 0;
        this.commands = commands.map(cmd => cmd.replaceTokens(replacementTokens));
        this._validateCommands();
    }

    _validateCommands() {
        if (!this.commands[0].isGoToCommand()) {
            throw new Error(
                `Expected first command to be ${CMD_GOTO}, got: ${this.commands[0].name}`
            );
        }
    }

    next() {
        return this.commands[this.cmd++] || null;
    }
}

class Command {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }

    isGoToCommand() {
        return this.name === CMD_GOTO;
    }

    replaceTokens(replacements) {
        this.args = this.args.map(arg => replacements[arg] || arg);
        return this;
    }
}

/**
 * Helper class to provide a more dynamic config with type checking
 */
class CMD {
    static _create(name, args) {
        return new Command(name, args);
    }

    static goTo(url) {
        return CMD._create(CMD_GOTO, [url]);
    }

    static enterText(id, text) {
        return CMD._create(CMD_ENTER_TEXT, [id, text]);
    }

    static clickAndWait(id) {
        return CMD._create(CMD_CLICK_AND_WAIT, [id]);
    }
}

module.exports = {
    Commands,
    CMD,
    TOKENS
};