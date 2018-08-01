displaySet = (set) ->
    if (set.hasOwnProperty("open_set"))
        return "\\left(#{set["open_set"]["min"]}; #{set["open_set"]["max"]}\\right)";
    else if (set.hasOwnProperty("closed_set"))
        return "\\left[#{set["closed_set"]["min"]}; #{set["closed_set"]["max"]}\\right]";            
    else if (set.hasOwnProperty("left_open_set"))
        return "\\left(#{set["left_open_set"]["min"]}; #{set["left_open_set"]["max"]}\\right]";
    else if (set.hasOwnProperty("right_open_set"))
        return "\\left[#{set["right_open_set"]["min"]}; #{set["right_open_set"]["max"]}\\right)";
    else if (set.hasOwnProperty("unions"))
        subsets = (set["unions"]).map((x) => displaySet(x)).reduce((prev, curr) => prev + "\\cup" + curr);
        return "\\left(#{subsets}\\right)";
    else if (set.hasOwnProperty("intersections"))
        subsets = (set["intersections"]).map((x) => displaySet(x)).reduce((prev, curr) => prev + "\\cap" + curr);
        return "\\left(#{subsets}\\right)"