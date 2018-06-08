<template>
  <div id="app">
    <h2>Mini-Scheme</h2>
    <h4>Source</h4>
    <textarea v-model="input"></textarea>
    <button @click="tokenize">Tokenize!</button>
    <Tokens :tokens="token_list"/>
    <button @click="parse">Parse!</button>
    <SyntaxTree :ast="abstract_syntax_tree"/>
    <button @click="evaluate">Eval!</button>
    <h4>Result</h4>
    {{result ? result : ""}}
  </div>
</template>

<script>
import {tokenize, parse, evaluate} from "./lang.js";
import SourceCode from "./components/SourceCode";
import Tokens from "./components/Tokens";
import SyntaxTree from "./components/SyntaxTree";

export default {
    name: "App",
    components: {
        SourceCode,
        Tokens,
        SyntaxTree,
    },
    data() {
        return {
            input: "(+ 2 (* 3 4))",
            token_list: false,
            abstract_syntax_tree: false,
            result: false,
        };
    },
    methods: {
        tokenize() {
            this.token_list = tokenize(this.input);
        },
        parse() {
            this.abstract_syntax_tree = parse(this.token_list.slice(0));
        },
        evaluate() {
            this.result = evaluate(this.abstract_syntax_tree);
        },
    },

};
</script>

<style>
body {
    font-family: sans-serif;
}
textarea {
  width: calc(100% - 44px);
  height: 100px;
  padding: 1px;
  margin-bottom: 10px;
}
li, span.token, textarea, p.code, code {
  font-family: monospace;
  font-size: 16px;
}
</style>
