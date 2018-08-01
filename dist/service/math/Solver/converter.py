import sys, json
import tex2pix
import base64
import os
import time

def tex2base64(string):
    file_name = str(time.time()).replace(".", "")
    tex_file = file_name + ".tex"
    png_file = file_name + ".png"
    try:
        with open(tex_file, 'w+') as file:
            file.write(string)
        f = open(tex_file)
        try: 
            r = tex2pix.Renderer(f)
            r.mkpng(png_file)
            tex2pix.check_latex_pkg('tikz.sty')
            encoded = base64.b64encode(open(png_file, "rb").read())
        finally:
            f.close()
        os.remove(tex_file)
        os.remove(png_file)
        return str(encoded)
    except Exception, e:
        os.remove(tex_file)
        os.remove(png_file)
        return ""

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    data = read_in()
    tex = data['tex']
    base64str = tex2base64(tex)
    # stop = timeit.default_timer()
    # time = stop - start 
    # datareturn = {}
    # datareturn["time"] = time
    # datareturn["result"] = base64str
    # json_data = json.dumps(datareturn)
    print base64str

if __name__ == '__main__':
    main()
