/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }] */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
"use strict";

// ============================================= //
// tokenize: Eingabe in logisch Blöcke aufteilen //
// ============================================= //
function tokenize(text) {
    return text
        .replace(/\(/g, " ( ")
        .replace(/\)/g, " ) ")
        .replace(/\n/g, " ")
        .split(" ")
        .filter(Boolean);
}

// ====================================== //
// parse: Struktur des Programms auslesen //
// ====================================== //
function parse(tokens) {
    if (tokens.length === 0) {
        throw SyntaxError("Unexpected end of program while reading");
    }
    let token = tokens.shift();
    if (token === "(") {
        const list = [];
        while (tokens[0] !== ")") {
            list.push(parse(tokens));
        }
        tokens.shift();
        return list;
    } else if (token === ")") {
        throw SyntaxError("Unexpected )");
    } else {
        return parse_atom(token);
    }
}

// ====================================== //
// parse_atom: Ein einzelnes Token parsen //
// ====================================== //
function parse_atom(token) {
    const number = parseFloat(token);
    if (isNaN(number)) {
        return token;
    } else {
        return number;
    }
}

// ================================ //
// built_ins: Eingebaute Funktionen //
// ================================ //
const built_ins = Object.freeze({
    "+": (a, b) => a + b,      "-": (a, b) => a - b,
    "*": (a, b) => a * b,      "/": (a, b) => a / b,
    ">": (a, b) => a > b,      "<": (a, b) => a < b,
    "=": (a, b) => a === b,   "!=": (a, b) => a !== b,
});

// ============================================= //
// special_forms: Spezial-Konstrukte der Sprache //
// ============================================= //
const special_forms = Object.freeze({
    "begin": function(args, env) {
        return args.map(arg => evaluate(arg, env)).slice(-1)[0];
    },
    "define": function(args, env) {
        const [name, value] = args;
        env[name] = evaluate(value, env);
    },
    "if": function(args, env) {
        const [cond, cons, alt] = args;
        if (evaluate(cond, env)) {
            return evaluate(cons, env);
        } else {
            return evaluate(alt, env);
        }
    },
    "lambda": function(args, env) {
        const [arg_names, body] = args;
        return ["lambda", arg_names, body, env];
    }
});

// ======================================== //
// evaluate: Einen Ausdruck 'exp' auswerten //
// ======================================== //
function evaluate(exp, env=Object.create(built_ins)) {
    if (typeof exp === "number") {   // Eine nackte Zahl
        return exp;
    } else if (typeof exp === "string") {  // Ein Name einer Variable
        if (exp in env) {
            return env[exp];
        } else {
            throw new ReferenceError("'" + exp + "' is not defined");
        }
    } else if (exp instanceof Array) {    // Eine Rechnung
        // Das erste Element ist der Name der Operation
        let [func_name, ...args] = exp;

        if (func_name in special_forms) {
            return special_forms[func_name](args, env);
        } else {
            const [func, ...args] = exp.map(x => evaluate(x, env));
            return apply(func, args);
        }
    } else {
        throw new Error("Cannot evaluate expression: " + exp);
    }
}

// ==================================================== //
// apply: Eine Funktion auf gegebene Parameter anwenden //
// ==================================================== //
function apply(func, args) {
    if (func instanceof Array) {
        // Scheme function call
        const [_, arg_names, body, closure] = func;
        const new_env = Object.create(closure);
        arg_names.forEach(function(name, i) {
            new_env[name] = args[i];
        });

        return evaluate(body, new_env);
    } else {
        // Native JavaScript function call
        return func(...args);
    }
}

export {tokenize, parse, parse_atom, evaluate, apply, built_ins, special_forms};