"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GrammarService {
    static getTreeFromLatex(latexString) {
        const nearley = require("nearley");
        const grammar = require("./grammar.js");
        // Create a Parser object from our grammar.
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        // Parse something!
        parser.feed(latexString);
        return Promise.resolve(parser.results[0]);
    }
}
exports.default = GrammarService;
