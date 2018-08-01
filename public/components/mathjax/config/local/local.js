/*************************************************************
 *
 *  MathJax/config/local/local.js
 *  
 *  Include changes and configuration local to your installation
 *  in this file.  For example, common macros can be defined here
 *  (see below).  To use this file, add "local/local.js" to the
 *  config array in MathJax.js or your MathJax.Hub.Config() call.
 *
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2009 Design Science, Inc.
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
MathJax.Hub.Config({
  CommonHTML: { linebreaks: { automatic: true } },
  "HTML-CSS": { linebreaks: { automatic: true } },
         SVG: { linebreaks: { automatic: true } }
});

MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
  var TEX = MathJax.InputJax.TeX;
  TEX.Macro("image", "\\mathrm{i}")
  TEX.Macro("euler", "\\mathrm{e}")
  TEX.Macro("posinf", "+\\infty")
  TEX.Macro("neginf", "-\\infty")
  TEX.Macro("power", "{#1}^{#2}", 2);
  TEX.Macro("limit", "\\lim_{#1 \\to #2}{#3}", 3);
  TEX.Macro("limitn", "\\lim {#1}", 1);
  TEX.Macro("fderi", "\\frac{\\mathrm{d} #1}{\\mathrm{d} #2}", 2);
  TEX.Macro("fnderi", "\\frac{\\mathrm{d}^{#1} #2}{\\mathrm{d} {#3}^{#1}}", 3);
  TEX.Macro("deri", "#1'", 1);
  TEX.Macro("nderi", "{#1}^{(#2)}", 2);
  TEX.Macro("exp", "\\mathrm{e}^{#1}", 1);
  TEX.Macro("nlog", "\\log_{#1}{#2}", 2);
  TEX.Macro("pnlog", "\\log_{#1}^{#2}{#3}", 3);
  TEX.Macro("logdec", "\\log{#1}", 1);
  TEX.Macro("plogdec", "\\log^{#1}{#2}", 2);
  TEX.Macro("lognepe", "\\ln{#1}", 1);
  TEX.Macro("plognepe", "\\ln^{#1}{#2}", 2);
  TEX.Macro("parentheses", "\\left(#1\\right)", 1);
  TEX.Macro("bracket", "\\left[#1\\right]", 1);
  TEX.Macro("absolute", "\\left|#1\\right|", 1);
  TEX.Macro("brace", "\\left\\{#1\\right\\}", 1);
  TEX.Macro("cursor", "\\class{blinking-cursor}{|}");
  TEX.Macro("summary", "\\displaystyle \\sum_{{#1}={#2}}^{#3}{#4}", 4);
  TEX.Macro("smallsummary", "\\scriptstyle \\sum_{{#1}={#2}}^{#3}{#4}", 4);
  TEX.Macro("product", "\\displaystyle \\prod_{{#1}={#2}}^{#3}{#4}", 4);
  TEX.Macro("smallproduct", "\\scriptstyle \\prod_{{#1}={#2}}^{#3}{#4}", 4);
  TEX.Macro("integral", "\\displaystyle \\int_{#1}^{#2}{#3\\mathrm{d}{#4}}", 4);
  TEX.Macro("smallintegral", "\\scriptstyle \\int_{#1}^{#2}{#3\\mathrm{d}{#4}}", 4);
  TEX.Macro("infint", "\\displaystyle \\int{#1\\mathrm{d}{#2}}", 2);
  TEX.Macro("smallinfint", "\\scriptstyle \\int{#1\\mathrm{d}{#2}}", 2);
  TEX.Macro("subscript", "{#1}_{#2}", 2);
  TEX.Macro("psubscript", "{#1}_{#2}^{#3}", 3);
  TEX.Macro("superscript", "{#1}^{#2}", 2);
  TEX.Macro("anglecomplex", "{#1}\\angle{#2}", 2);
  // place macros here.  E.g.:
  //   TEX.Macro("R","{\\bf R}");
  //   TEX.Macro("op","\\mathop{\\rm #1}",1); // a macro with 1 parameter
});

MathJax.Ajax.loadComplete("[MathJax]/config/local/local.js");
