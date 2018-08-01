export default class TexGenerator {
    public static GenerateConsideringSignTable(values: Array<String>, signs: Array<String>, variable: String): String {
        var valueString = values.map((x) => `$ ${x} $`).reduce((prev, curr) => prev + "," + curr);
        var signString = signs.map((x) => `${x}`).reduce((prev, curr) => prev + "," + curr);
        var result = "\\documentclass[preview]{standalone}" +
        "\\usepackage{tikz,tkz-tab}" +
        "\\begin{document}" +
            "\\begin{tikzpicture}" +
            "\\tkzTabInit" +
            "[lgt=1,espcl=2.3]" +
            `{$${variable}$/1, $f(${variable})$/1}` +
            `{${valueString}}` +
            `\\tkzTabLine{${signString}}` +
            "\\end{tikzpicture}" +
        "\\end{document}";
        return result;
    }

    public static GenerateConsideringChangeTableForLinerFunction(positive: Boolean): String  {
        var result = "\\documentclass[preview]{standalone}" +
        "\\usepackage{tikz,tkz-tab}" +
        "\\begin{document}" +
        "\\begin{tikzpicture}" +
        "\\tkzTabInit" +
        "[lgt=1.5,espcl=0.015\\linewidth]" +
        "{$x$/.8, $f(x)$/1.5}" +
        "{$-\\infty$,$+\\infty$}" +
        `\\tkzTabVar{${positive ? "-" : "+"}/ $-\\infty$ , ${positive ? "+" : "-"}/ $+\\infty$}` + 
        "\\end{tikzpicture}" +
        "\\end{document}";        
        return result;
    }

    public static GenerateConsideringChangeTableForQuadraticFunction(positive: Boolean, I: Object): String  {
        var result: String = null;
        if (positive) {
            result = "\\documentclass[preview]{standalone}" +
            "\\usepackage{tikz,tkz-tab}" +
            "\\begin{document}" +
            "\\begin{tikzpicture}" +
            "\\tkzTabInit" +
            "[lgt=1.3,espcl=0.01\\linewidth]" +
            "{$x$/.8, $f(x)$/1.5}" +
            `{$-\\infty$,$${I["x"]}$,$+\\infty$}` +
            `\\tkzTabVar{+/ $-\\infty$ , -/ $${I["y"]}$ ,+/ $+\\infty$}` + 
            "\\end{tikzpicture}" +
            "\\end{document}"; 
        }
        else {
            result = "\\documentclass[preview]{standalone}" +
            "\\usepackage{tikz,tkz-tab}" +
            "\\begin{document}" +
            "\\begin{tikzpicture}" +
            "\\tkzTabInit" +
            "[lgt=1.3,espcl=0.01\\linewidth]" +
            "{$x$/.8, $f(x)$/1.5}" +
            `{$-\\infty$,$${I["x"]}$,$+\\infty$}` +
            `\\tkzTabVar{-/ $-\\infty$ , +/ $${I["y"]}$ ,-/ $+\\infty$}` + 
            "\\end{tikzpicture}" +
            "\\end{document}"; 
        }
               
        return result;
    }

    public static GenerateConsideringChangeTableForCubicFunction(considering_change: Object, root: Array<String>, val: Array<String>) {
        var result = "\\documentclass[preview]{standalone}" +
        "\\usepackage{tikz,tkz-tab}" +
        "\\begin{document}" +
        "\\begin{tikzpicture}" +
        "\\tkzTabInit" +
        "[lgt=1.3,espcl=2.5]" +
        "{$x$/0.8, $f'(x)$/0.8, $f(x)$/1.8}" +
        `{${considering_change["val"].reduce((prev, curr) => prev + "," + curr)}}` +
        `\\tkzTabLine{${considering_change["sign"].reduce((prev, curr) => prev + "," + curr)}}` + 
        `\\tkzTabVar{${considering_change["change"].reduce((prev, curr) => prev + "," + curr)}}` +
        `${root.length === 1 ? `\\tkzTabIma{1}{3}{2}{$${val[0]}$}` : ""}` +
        "\\end{tikzpicture}" +
        "\\end{document}";
        return result;
    }

    public static GenerateConsideringChangeTableForBiquadraticFunction(considering_change: Object, root: Array<String>, val: Array<String>) {
        var result = "\\documentclass[preview]{standalone}" +
        "\\usepackage{tikz,tkz-tab}" +
        "\\begin{document}" +
        "\\begin{tikzpicture}" +
        "\\tkzTabInit" +
        "[lgt=1.3,espcl=2.5]" +
        "{$x$/0.8, $f'(x)$/0.8, $f(x)$/1.8}" +
        `{${considering_change["val"].reduce((prev, curr) => prev + "," + curr)}}` +
        `\\tkzTabLine{${considering_change["sign"].reduce((prev, curr) => prev + "," + curr)}}` + 
        `\\tkzTabVar{${considering_change["change"].reduce((prev, curr) => prev + "," + curr)}}` +
        "\\end{tikzpicture}" +
        "\\end{document}";
        return result;
    }

    public static GenerateConsideringChangeTableForLinearRationalFunction(considering_change: Object, root: Array<String>, val: Array<String>) {
        var result = "\\documentclass[preview]{standalone}" +
        "\\usepackage{tikz,tkz-tab}" +
        "\\begin{document}" +
        "\\begin{tikzpicture}" +
        "\\tkzTabInit" +
        "[lgt=1.5,espcl=3]" +
        "{$x$/0.8, $f'(x)$/0.8, $f(x)$/1.8}" +
        `{${considering_change["val"].reduce((prev, curr) => prev + "," + curr)}}` +
        `\\tkzTabLine{${considering_change["sign"].reduce((prev, curr) => prev + "," + curr)}}` + 
        `\\tkzTabVar{${considering_change["change"].reduce((prev, curr) => prev + "," + curr)}}` +
        "\\end{tikzpicture}" +
        "\\end{document}";
        return result;
    }

    public static GenerateConsideringChangeTableForQuadraticAndLinearRationalFunction(considering_change: Object, root: Array<String>, val: Array<String>) {
        var result = "\\documentclass[preview]{standalone}" +
        "\\usepackage{tikz,tkz-tab}" +
        "\\begin{document}" +
        "\\begin{tikzpicture}" +
        "\\tkzTabInit" +
        "[lgt=1.5,espcl=3]" +
        "{$x$/0.8, $f'(x)$/0.8, $f(x)$/1.8}" +
        `{${considering_change["val"].reduce((prev, curr) => prev + "," + curr)}}` +
        `\\tkzTabLine{${considering_change["sign"].reduce((prev, curr) => prev + "," + curr)}}` + 
        `\\tkzTabVar{${considering_change["change"].reduce((prev, curr) => prev + "," + curr)}}` +
        "\\end{tikzpicture}" +
        "\\end{document}";
        return result;
    }

    public static GenerateConsideringChangeTable(considering_change: Object) {
        var result = "\\documentclass[preview]{standalone}" +
        "\\usepackage{tikz,tkz-tab}" +
        "\\begin{document}" +
        "\\begin{tikzpicture}" +
        "\\tkzTabInit" +
        "[lgt=1.5,espcl=3]" +
        "{$x$/0.8, $f'(x)$/0.8, $f(x)$/1.8}" +
        `{${considering_change["val"].reduce((prev, curr) => prev + "," + curr)}}` +
        `\\tkzTabLine{${considering_change["sign"].reduce((prev, curr) => prev + "," + curr)}}` + 
        `\\tkzTabVar{${considering_change["change"].reduce((prev, curr) => prev + "," + curr)}}` +
        "\\end{tikzpicture}" +
        "\\end{document}";
        return result;
    }
}