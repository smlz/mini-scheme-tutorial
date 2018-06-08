
import {tokenize, parse, parse_atom, built_ins, special_forms, evaluate, apply} from "@/lang";

describe("lang.js", () => {
    it("tokenize correctly", () => {
        expect(tokenize("( a b ( d e ) f )")).toEqual(["(", "a", "b", "(", "d", "e", ")", "f", ")"]);
        expect(tokenize("(a b c)")).toEqual(["(", "a", "b", "c", ")"]);
        expect(tokenize("(a b\nc)")).toEqual(["(", "a", "b", "c", ")"]);
        expect(tokenize("  (  a   \n b   c)")).toEqual(["(", "a", "b", "c", ")"]);
    });
    it("parse correctly", () => {
        expect(parse("( a b c )".split(" "))).toEqual(["a", "b", "c"]);
        expect(parse("( ( ( ) ) )".split(" "))).toEqual([[[]]]);
        expect(() => parse(["("])).toThrow(SyntaxError("Unexpected end of program while reading"));
        expect(() => parse([")"])).toThrow(SyntaxError("Unexpected )"));
    });
    it("parse atoms correctly", () => {
        expect(parse_atom("a")).toEqual("a");
        expect(parse_atom("-1.2")).toEqual(-1.2);
        expect(parse_atom("1.7e6")).toEqual(1700000);
        expect(parse("( * 1 ( + 2 3 ) )".split(" "))).toEqual(["*", 1, ["+", 2, 3]]);
    });
    it("to have built-in functions", () => {
        expect(typeof (built_ins["+"])).toEqual("function");
        expect(typeof (built_ins["-"])).toEqual("function");
        expect(typeof (built_ins["*"])).toEqual("function");
        expect(typeof (built_ins["/"])).toEqual("function");
        expect(built_ins["+"](3, 2)).toEqual(5);
        expect(built_ins["-"](2, 3)).toEqual(-1);
        expect(built_ins["*"](3, 2)).toEqual(6);
        expect(built_ins["/"](3, 2)).toEqual(1.5);
    });
    it("to have 'begin' and 'define' special forms", () => {
        expect(typeof special_forms["begin"]).toEqual("function");
        expect(typeof special_forms["define"]).toEqual("function");
        expect(special_forms["begin"](["a", "b", "c"], {a: 2, b: 3, c: 7})).toEqual(7);
        expect(special_forms["define"](["a", 7], {})).toEqual(undefined);
        const env = {};
        special_forms["define"](["a", 7], env);
        expect(env).toEqual({a: 7});
    });
    it("to eval calculations", () => {
        expect(evaluate(["*", 2, 3])).toEqual(6);
        expect(() => { evaluate(["tutu", 1, 2]); }).toThrow(new ReferenceError("'tutu' is not defined"));
        expect(() => { evaluate({}); }).toThrow(new Error("Cannot evaluate expression: [object Object]"));

    });

    it("lambda", () => {
        expect(evaluate(parse(tokenize(`(begin
            (define make_adder (lambda (a) (lambda (b) (+ a b))))
            (define plus5 (make_adder 5))
            (plus5 2)
        )`)))).toEqual(7);
        expect(apply(["lambda", ["a", "b"], ["-", "b", "a"], {"-": (a, b) =>  a - b}], [3, 2])).toEqual(-1);
    });
    it("if", () => {
        for (let op of "> < = !=".split(" ")) {
            expect(typeof built_ins[op]).toEqual("function");
            expect(typeof built_ins[op](1, 2)).toEqual("boolean");
        }
        expect(evaluate(parse(tokenize(`(begin
            (define abs (lambda (a) (if (> a 0) a (- 0 a))))
            (+ (abs 1)
            (abs -1))
        )`)))).toEqual(2);
    });
});
