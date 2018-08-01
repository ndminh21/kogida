# http://www.json.org/
# http://www.asciitable.com/
@{%

const moo = require('moo')

let lexer = moo.compile({
    space: {match: /\s+/, lineBreaks: true},
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    //string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    ',': ',',
    ':': ':',
    sqrt : 'sqrt',
    ecapse:'\\',
    true: 'true',
    false: 'false',
    null: 'null',
})

%}

@lexer lexer



number -> %number {% function(d) { return parseFloat(d[0].value) } %}

sqrt -> %sqrt "{" number "}"{%
    function(d){
        return {
            type : "sqrt",
            value : d[1]
        }
    }
%}    

#_ -> null | %space {% function(d) { return null; } %}

@{%

function extractPair(kv, output) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject(d) {
    let output = {};

    extractPair(d[2], output);

    for (let i in d[3]) {
        extractPair(d[3][i][3], output);
    }

    return output;
}

function extractArray(d) {
    let output = [d[2]];

    for (let i in d[3]) {
        output.push(d[3][i][3]);
    }

    return output;
}

%}
