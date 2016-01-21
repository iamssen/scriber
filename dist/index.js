if (window && !window.hasOwnProperty('exports'))
    window['exports'] = {};
function trim(text) {
    var lines = text.replace(/\r/g, '').split('\n');
    var reg = /^(\s*)/;
    var f = -1;
    var fmax = lines.length;
    while (++f < fmax) {
        var line = lines[f];
        if (line.trim().length > 0) {
            lines = lines.slice(f);
            if (reg.test(line)) {
                return lines.map(function (line) { return line.replace(new RegExp("^(" + reg.exec(line)[0] + ")"), ''); }).join('\n');
            }
        }
    }
    return text;
}
var Doc = (function () {
    function Doc(element, params) {
        this.params = params;
        this._element = element;
        this.selection = d3.select(element);
    }
    Object.defineProperty(Doc.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Doc.prototype.div = function (html, css) {
        if (css === void 0) { css = 'scriber-html'; }
        this.selection
            .append('div')
            .attr('class', css)
            .html(html);
    };
    Doc.prototype.md = function (markdown, css) {
        if (css === void 0) { css = 'scriber-markdown'; }
        this.div(marked(trim(markdown)), css);
    };
    Doc.prototype.code = function (source, extension, css) {
        if (extension === void 0) { extension = ''; }
        if (css === void 0) { css = 'scriber-code'; }
        this.md('```' + extension + '\n' + trim(source) + '\n' + '```', css);
    };
    Doc.prototype.gist = function (source) {
        var css = 'scriber-gist';
        source = source.trim();
        if (source.indexOf('<script') === 0) {
            this.div(source, css);
        }
        else if (source.indexOf('https://gist.github.com') === 0) {
            this.div("<script src=\"" + source + ".js\"></script>", css);
        }
    };
    Doc.prototype.jsfiddle = function (source) {
        var css = 'scriber-jsfiddle';
        source = source.trim();
        if (source.indexOf('<script') === 0) {
            this.div(source, css);
        }
        else if (source.indexOf('https://jsfiddle.net') === 0) {
            this.div("<script async src=\"" + source + "embed\"></script>", css);
        }
    };
    Doc.prototype.youtube = function (source, width, height) {
        if (width === void 0) { width = 560; }
        if (height === void 0) { height = 315; }
        var css = 'scriber-youtube';
        source = source.trim();
        if (source.indexOf('<iframe') === 0) {
            this.div(source, css);
        }
        else {
            var reg = /([a-zA-Z0-9_-]{11})/;
            if (reg.test(source)) {
                var arr = reg.exec(source);
                var id = arr[0];
                this.div("<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://www.youtube.com/embed/" + id + "\" frameborder=\"0\" allowfullscreen></iframe>", css);
            }
        }
    };
    return Doc;
})();
exports.Doc = Doc;
function scriber(generator, element, params) {
    generator(new Doc(element, params));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scriber;
//# sourceMappingURL=index.js.map