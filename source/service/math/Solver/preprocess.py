import re

def preprocess(function):
    function = function.replace(" ", "")
    match = re.search(r'[^>\|<]=', str(function))
    if match:
        match = re.search(r'=0$', str(function))
        if match:
            return str(function.replace("=0", ""))
        else:
            index_eq = str(function).index('=')
            new_function = str(function)[:index_eq]+'-('+str(function)[index_eq+1:]+')'
            return new_function
    return function