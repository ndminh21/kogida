"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalculatorService = require("./dist/service/math/CalculatorService").default;
const GrammarService_1 = require("./dist/service/grammar/GrammarService").default;
const Tree_js_1 = require("./dist/service/math/Tree.js").default;
const Parse_1 = require("./dist/service/math/./Parse").default;

const inputArr = [
    "(1+2)",
    "((2+nsimplify(sqrt(3)))+4)",
    "nsimplify(log(1000, 10))",
    "(expand(3**2)+sin(pi/180*((180))))",
    "Integral(((2*x)+3),x).doit()"
]

const ArrVar = [
    [],
    [],
    [],
    [],
    ['x']
]

const expectArr = [
    "3",
    "\\sqrt{3} + 6",
    "3",
    "9",
    "x^{2} + 3 x"
]
//Test tính toán từ chuỗi sympy và trả về kết quả latex
exports.testcase1 = async function (test) {
    test.expect(1);
    var input = inputArr[0];
    var inputArrVar = []
    var expect = "3";
    var result = await CalculatorService.calculate(input, inputArrVar)
    console.log("Input: " + input)
    console.log("Output: "+ result)
    test.equal(result, expect, "Pass")
    test.done();
};
exports.testcase2 = async function (test) {
    test.expect(1);
    var input = "((2+nsimplify(sqrt(3)))+4)";
    var inputArrVar = []
    var expect = "\\sqrt{3} + 6";
    var result = await CalculatorService.calculate(input, inputArrVar)
    console.log("Input: " + input)
    console.log("Output: " + result)
    test.equal(result, expect, "Pass")
    test.done();
};
exports.testcase3 = async function (test) {
    test.expect(1);
    var input = "nsimplify(log(1000,10))";
    var inputArrVar = []
    var expect = "3";
    var result = await CalculatorService.calculate(input, inputArrVar)
    console.log("Input: " + input)
    console.log("Output: " + result)
    test.equal(result, expect, "Pass")
    test.done();
};
exports.testcase4 = async function (test) {
    test.expect(1);
    var input = "(expand(3**2)+sin(pi/180*((180))))";
    var inputArrVar = []
    var expect = "9";
    var result = await CalculatorService.calculate(input, inputArrVar)
    console.log("Input: " + input)
    console.log("Output: " + result)
    test.equal(result, expect, "Pass")
    test.done();
};
exports.testcase5 = async function (test) {
    test.expect(1);
    var input = "Integral(((2*x)+3),x).doit()";
    var inputArrVar = ['x']
    var expect = "x^{2} + 3 x";
    var result = await CalculatorService.calculate(input, inputArrVar)
    console.log("Input: " + input)
    console.log("Output: " + result)
    test.equal(result, expect, "Pass")
    test.done();
};

