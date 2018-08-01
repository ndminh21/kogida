"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GrammarService= require("./dist/service/grammar/GrammarService").default;
const KogidaTree = require("./dist/service/math/Tree.js").default;
const Parse = require("./dist/service/math/./Parse").default;
const CalculatorService = require("./dist/service/math/CalculatorService").default;
const inputLatex = [
    "\\sqrt{2}\\times \\sqrt{3}",
    "31\\times 12-21+31/5",
    "\\cos{\\left(\\frac{\\pi }{4}\\right)}+\\sin{\\left(\\frac{\\pi }{6}\\right)}",
    "\\sin{\\left(30\\right)}+\\cos{\\left(60\\right)}",
    "\\power{21}{3}",
    "\\deri{\\left(2x+2\\power{x}{3}+1\\right)}",
    "\\frac{1}{3}+\\frac{21}{7}+\\frac{6}{8}",
    "\\limit{x}{10}{10x}",
    "\\infint{\\left(2x+3\\right)}{x}",
    "\\log_{10}{100}",
    "\\log_{10}{100}"
]
const arrMode = [
    "deg",
    "deg",
    "rad",
    "deg",
    "deg",
    "deg",
    "deg",
    "deg",
    "deg",
    "deg",
]

const arrOut = [
    "\\sqrt{6}",
    "\\frac{1786}{5}",
    "\\frac{1}{2} + \\frac{\\sqrt{2}}{2}",
    "1",
    "9261",
    "6 x^{2} + 2",
    "\\frac{49}{12}",
    "100",
    "x^{2} + 3 x",
    "2"
]
exports.integrationtest = {
    testcase1 : async function(test) {
        test.expect(1);
        var inputLatex = "\\sqrt{2}\\times \\sqrt{3}";
        var inputMode = 'deg'
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        var expect = "\\sqrt{6}";
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },  
    testcase2: async function (test) {
        test.expect(1);
        var inputLatex = "31\\times 12-21+31/5";
        var inputMode = 'deg'
        var expect = "\\frac{1786}{5}";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },
    testcase3 :  async function (test) {
        test.expect(1);
        var inputLatex = "\\cos{\\left(\\frac{\\pi }{4}\\right)}+\\sin{\\left(\\frac{\\pi }{6}\\right)}";
        var inputMode = 'rad'
        var expect = "\\frac{1}{2} + \\frac{\\sqrt{2}}{2}";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },

    testcase4 :  async function (test) {
        test.expect(1);
        var inputLatex = "\\sin{\\left(30\\right)}+\\cos{\\left(60\\right)}";
        var inputMode = 'deg'
        var expect = "1";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },

    testcase5 : async function (test) {
        test.expect(1);
        var inputLatex = "\\power{21}{3}";
        var inputMode = 'deg'
        var expect = "9261";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },

    testcase6 : async function (test) {
        test.expect(1);
        var inputLatex = "\\deri{\\left(2x+2\\power{x}{3}+1\\right)}";
        var inputMode = 'deg'
        var expect = "6 x^{2} + 2";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },


    testcase7 :  async function (test) {
        test.expect(1);
        var inputLatex = "\\frac{1}{3}+\\frac{21}{7}+\\frac{6}{8}";
        var inputMode = 'deg'
        var expect = "\\frac{49}{12}";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },

    testcase8 : async function (test) {
        test.expect(1);
        var inputLatex = "\\limit{x}{10}{10x}";
        var inputMode = 'deg'
        var expect = "100";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },

    testcase9 :  async function (test) {
        test.expect(1);
        var inputLatex = "\\infint{\\left(2x+3\\right)}{x}";
        var inputMode = 'deg'
        var expect = "x^{2} + 3 x";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    },

    testcase10 : async function (test) {
        test.expect(1);
        var inputLatex = "\\log_{10}{100}";
        var inputMode = 'deg'
        var expect = "2";
        //Tạo cây từ chuỗi latex
        var tree = await GrammarService.getTreeFromLatex(inputLatex);
        //Tạo ra cây kogida
        var Tree = new KogidaTree(tree)
        let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
        if (inputMode === "deg")
            var sympy = Parse.parseToSymPyDegree(tree)
        else
            var sympy = Parse.parseToSymPyRad(tree)
        //Tính kết quả từ chuỗi sympy     
        var result = await CalculatorService.calculate(sympy, variablesJSON)
        console.log("Input: " + inputLatex)
        console.log("Output: " + result)
        test.equal(result, expect, "Pass")
        test.done();
    }
}


