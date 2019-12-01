window.addEventListener('load', function() {
    window.ratio = window.devicePixelRatio || 1;
    window.tela = {
        width: window.screen.width * ratio,
        height: window.screen.height * ratio
    };
    var mac = navigator.userAgent.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
    if (mac) {
        document.body.classList.add("ios");
        if (tela.width == 1125 && tela.height === 2436) {
            document.body.classList.add("iphone-x");
        }
    }

    let versionI = window.location.search.indexOf('?') > -1 ? '&' : '?';
    let version = (new Date().getTime());
    if (GET().version == undefined) window.location.href += versionI + 'version=' + version;
    version = GET().version;
    document.getElementById('mainCSS').setAttribute('href', 'main.css?version=' + version);
    let mainJS = document.createElement('script');
    mainJS.setAttribute('src', 'main.js?version=' + version);
    document.body.appendChild(mainJS);
    document.getElementById('mainJS').remove();

    setTimeout(function() { document.body.classList.add("loaded"); }, 2000);

    document.body.style.width = window.screen.width + 'px';
    document.body.style.height = window.screen.height + 'px';

    window.Store = new Storage("Contas", 1);
    loadScript("run.js");
});

function loadScript(src) {
    let script = document.createElement('script');
    script.setAttribute('src', src + '?version=' + GET().version);
    document.body.appendChild(script);
}

function loadStyle(src) {
    let style = document.createElement('link');
    style.setAttribute('href', src + '?version=' + GET().version);
    style.setAttribute('rel', "stylesheet");
    style.setAttribute('type', "text/css");
    style.setAttribute('media', "screen");
    document.body.appendChild(style);
}

function GET() {
    var qs = window.location.search.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

HTMLElement.prototype.scrollTo = function(to, duration = 1000) {
    var element = this,
        start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 50;
    element.timeout = element.timeout || null;
    if (element.scrollingTo == true) clearTimeout(element.timeout);
    element.timeout = setInterval(function() {
        currentTime += increment;
        var val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime > duration) {
            clearInterval(element.timeout);
            element.scrollingTo = false;
        }
    }, 20);
    element.scrollingTo = true;
};

function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function() {
        currentTime += increment;
        var val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

var easeInOutQuad = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createScreenIn(origin = "50% 50%", config = {}) {
    var screen = document.createElement('screen');
    screen.config = config;
    screen.style.transformOrigin = origin;
    screen.classList.add('transition');
    screen.id = `screen${(new Date().getTime())}`;
    screen.innerHTML = `<header class="show-back">
                            <status-bar></status-bar>
                            <nav-bar>
                                <back-button>
                                    <android-reflect></android-reflect>
                                    <arrow></arrow>
                                </back-button>
                                <header-title></header-title>
                                <right-buttons></right-buttons>
                            </nav-bar>
                        </header>
                        <content></content>`;
    screen.setTitle = function(title) {
        var headerTitle = screen.querySelector('header-title');
        if (headerTitle != null) headerTitle.innerHTML = title;
    };
    screen.showHeader = function(title) {
        var header = screen.querySelector('header');
        if (header != null) header.classList.remove('hide');
    };
    screen.hideHeader = function(title) {
        var header = screen.querySelector('header');
        if (header != null) header.classList.add('hide');
    };
    screen.setHeaderColor = function(color = '') {
        var header = screen.querySelector('header');
        if (header != null && color != '') header.style.backgroundColor = color;
    };
    screen.setHeaderTextColor = function(color = '') {
        var header = screen.querySelector('header');
        if (header != null && color != '') header.style.color = color;
    };
    screen.showBackButton = function() {
        var header = screen.querySelector('header');
        if (header != null) header.classList.add('show-back');
    };
    screen.hideBackButton = function() {
        var header = screen.querySelector('header');
        if (header != null) header.classList.remove('show-back');
    };
    screen.getContent = function() {
        var content = screen.querySelector('content');
        return content;
    };
    let onCloseEvent = new Event('close');
    screen.close = function() {
        let s = screen;
        screen.classList.add('out');
        screen.dispatchEvent(onCloseEvent);
        if (screen.config.autoremove == true) {
            setTimeout(function() {
                s.remove();
            }, 500);
        } else {
            setTimeout(function() {
                s.classList.remove('in');
                s.classList.remove('out');
            }, 500);
        }
    };
    let afterOpenEvent = new Event('after-open');
    screen.open = function() {
        screen.classList.add('in');
        setTimeout(() => {
            screen.dispatchEvent(afterOpenEvent);
        }, 500);
    };
    let backbutton = screen.querySelector('back-button');
    backbutton.onclick = function() {
        screen.close();
    };
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            const value = config[key];
            switch (key) {
                case 'title':
                    screen.setTitle(value);
                    break;
                case 'color':
                    screen.setHeaderColor(value);
                    break;
                case 'text':
                    screen.setHeaderTextColor(value);
                    break;
                case 'header':
                    if (value == false) screen.hideHeader();
                    break;
                case 'backbutton':
                    if (value == false) screen.hideBackButton();
                    break;
                case 'autoshow':
                    if (value == true) {
                        setTimeout(function() {
                            screen.open();
                        }, 300);
                    }
                    break;
                case `children`:
                    appendChildFromObject(screen.querySelector('content'), value);
                    break;
            }
        }
    }
    document.querySelector('app').appendChild(screen);
    return screen;
}


function appendChildFromObject(destiny, object = {}, fillOff = false) {
    if (typeof object !== 'object') return;
    if (!(destiny instanceof HTMLElement)) return;
    if (fillOff == true) destiny.innerHTML = "";
    for (const NodeName in object) {
        if (object.hasOwnProperty(NodeName)) {
            const _o = object[NodeName];
            let lo = Array.isArray(_o) ? _o : [_o];
            let keyCounter = 0;
            for (const o of lo) {
                let e = document.createElement(NodeName);
                if (lo.length > 1) {
                    e.setAttribute('key', keyCounter);
                    keyCounter++;
                }
                for (const key in o) {
                    if (o.hasOwnProperty(key)) {
                        if (key == "classes" && Array.isArray(o[key])) {
                            for (const _className of o[key]) {
                                e.classList.add(_className);
                            }
                        } else if (key == "style" && typeof o[key] == "object") {
                            for (const style in o[key]) {
                                if (o[key].hasOwnProperty(style)) {
                                    e.style[style] = o[key][style];
                                }
                            }
                        } else if (key == "children" && typeof o[key] == "object") {
                            appendChildFromObject(e, o[key]);
                        } else if (key.indexOf('_') == 0) {
                            e.setAttribute(key.replace('_', ''), o[key]);
                        } else if (key.indexOf('data-') == 0) {
                            e.setAttribute(key, o[key]);
                        } else {
                            e[key] = o[key];
                        }
                    }
                }
                destiny.appendChild(e);
            }
        }
    }
}

function Storage(name = "pwa", version = 1, isColletion = false) {
    this.__store = {};
    this.save = () => {
        return window.localStorage.setItem(`[${name}~]v(${version})`, JSON.stringify(this.__store));
    };

    if (isColletion == false) {
        this.__colletions = {};
        this.createColletion = (colletion_name = "pwa", colletion_version = 1) => {
            this.__store[`colletion(${colletion_name})`] = `colletion::[${colletion_name}~]v(${colletion_version})::${colletion_name}::${colletion_version}`;
            this.__colletions[`[${colletion_name}~]v(${colletion_version})`] = new Storage(colletion_name, colletion_version, true);
            this.save();
        };
        this.getColletion = (colletion_name = "pwa") => {
            if (typeof colletion_name !== "string" || colletion_name.length == 0) return null;
            if (typeof this.__store[`colletion(${colletion_name})`] !== 'undefined') {
                const t = this.__store[`colletion(${colletion_name})`].split("::");
                return this.__colletions[t[1]];
            }
            return null;
        };
        this.get = (key) => {
            if (typeof key !== "string" || key.length == 0) return null;
            if (typeof this.__store[key] == 'undefined') {
                return this.getColletion(key);
            } else {
                return this.__store[key];
            }
        };
        this.set = (key, value) => {
            if (typeof key !== "string" || key.length == 0) return;
            this.__store[key] = value;
            this.save();
        };
    } else {
        this.insert = (value) => {
            let id = `entry${(new Date().getTime())}`;
            this.__store[id] = value;
            this.save();
            return id;
        };
        this.update = (id = null, value) => {
            if (typeof id !== "string" || id.length == 0) return;
            this.__store[id] = value;
            this.save();
        }
        this.remove = (id = null) => {
            if (typeof id !== "string" || id.length == 0) return;
            this.save();
        };
        this.list = () => {
            let list = [];
            let d = Object.keys(this.__store);
            for (const key of d) {
                list.push(this.__store[key]);
            }
            return list;
        };
    }

    try {
        let w = window.localStorage.getItem(`[${name}~]v(${version})`);
        if (w == null) {
            this.__store = {};
            this.save();
        } else {
            this.__store = JSON.parse(w);
            if (isColletion == false) {
                for (const key in this.__store) {
                    if (this.__store.hasOwnProperty(key)) {
                        if (key.indexOf(`colletion(`) == 0) {
                            const t = this.__store[key].split("::");
                            try {
                                this.__colletions[t[1]] = new Storage(t[2], parseInt(t[3]), true);
                            } catch (error) {}
                        }
                    }
                }
            }
        }
    } catch (error) {
        this.save();
    }
}