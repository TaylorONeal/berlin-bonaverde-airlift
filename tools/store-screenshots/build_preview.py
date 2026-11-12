import sys, os, re, base64, glob
S = sys.argv[1]
old = open(S + '/preview/index.html').read()
pre = old[:old.index('<script>')]
js = open(glob.glob(S + '/web/_expo/static/js/web/index-*.js')[0]).read()
n = 0
for f in glob.glob(S + '/web/assets/**/*.ttf', recursive=True):
    rel = '/' + os.path.relpath(f, S + '/web')
    if rel in js:
        uri = 'data:font/ttf;base64,' + base64.b64encode(open(f, 'rb').read()).decode()
        js = js.replace(rel, uri); n += 1
js = js.replace('</script', '<\\/script')
open(S + '/preview/index.html', 'w').write(pre + '<script>' + js + '</script>\n')
print('fonts inlined', n, 'size', os.path.getsize(S + '/preview/index.html'))
