var originalData = [],
  size = 3,
  divs;
var moves = 0,
  bscore = 0,
  ttime = 0;
var date, matches = 0;
var gameDivs = document.querySelectorAll(".game-divs")[0];
var bind = {
  load: function() {
    bind.hide(1);
    setTheme.setup();
    bind.click();
  },
  hide: function(e) {
    let flexDivs = document.querySelectorAll(".flex > div");
    flexDivs.forEach((v, i) => {
      v.classList.add("hide");
      if (i == e) { v.classList.remove("hide") };
    });
  },
  click: function() {
    document.querySelectorAll(".home p.start-game")[0].onclick = function() {
      bind.hide(2);
      game.setUp();
    };
    document.querySelectorAll(".game p")[0].onclick = function() {
      game.win(false);
    };
    document.querySelectorAll(".result span")[0].onclick = function() {
      bind.hide(1);
    };
  }
};
var themeData = {
  light: ["black", "white", "#55634242"],
  dark: ["white", "#282828", "#C8C85950"],
  black: ["white", "black", "#B57B4953"],
  blue: ["#FFF6A3", "#407AFF", "#64101051"],
  green: ["#BA8FFF", "#007234", "#FF8F8F50"]
};
var root = document.querySelectorAll(":root")[0];
var setTheme = {
  setup: function() {
    moves = 0;
    date = Date.now();
    var themes = document.querySelectorAll('input[name="t"')
    themes.forEach((v) => {
      v.style.setProperty("--bg", themeData[v.value][1])
      v.onchange = function() {
        setTheme.changeTheme(v.value);
      };
    });
    let images = document.querySelectorAll('input[name="i"]');
    images.forEach((v) => {
      v.style.setProperty("--bgi", "url(" + v.value + ".jpg)");
      v.onchange = function() {
        setTheme.changeImage(v.value);
      };
    });
    let sizeBox = document.querySelectorAll(".choose-size")[0];
    sizeBox.onchange = function() {
      root.style.setProperty("--size", sizeBox.value);
    };
  },
  changeTheme: function(v) {
    let themeArray = themeData[v];
    root.style.setProperty("--color", themeArray[0]);
    root.style.setProperty("--back", themeArray[1]);
    root.style.setProperty("--back-2", themeArray[2]);
  },
  changeImage: function(v) {
    root.style.setProperty("--image", "url(" + v + ".jpg)");
  },
};

var game = {
  setUp: function() {
    matches += 1;
    gameDivs.innerHTML = "";
    originalData = [];
    size = getComputedStyle(root).getPropertyValue("--size");
    let iy, jx;
    for (let i = Number(size); i > 0; i--) {
      for (let j = Number(size); j > 0; j--) {
        (i == size) ? iy = 0: iy = i;
        (j == size) ? jx = 0: jx = j;
        gameDivs.insertAdjacentHTML(Math.floor(Math.random() * 2) ? "beforeend" : "afterbegin", "<div c=" + String(i) + String(j) + " style='--x:" + jx + ";--y:" + iy + "'></div>");
        originalData.push(i + String(j));
      };
    };
    setTimeout(game.play, 10);
  },
  play: function() {
    moves++;
    let currentData = [];
    divs = document.querySelectorAll(".game-divs div");
    let page;
    divs.forEach((v, i) => {
      currentData.push(v.getAttribute("c"));
      v.ontouchstart = function(e) {
        page = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        v.ontouchend = function(f) {
          x = page.x - f.changedTouches[0].clientX;
          y = page.y - f.changedTouches[0].clientY;
          if (Math.abs(x) > Math.abs(y)) {
            (page.x > f.changedTouches[0].clientX) ? move.right(i): move.left(i);
          } else {
            (page.y > f.changedTouches[0].clientY) ? move.up(i): move.down(i);
          }
        };
      };
    });
    if (String(currentData) == String(originalData)) { game.win(true) };
  },
  win: function(e) {
    bind.hide(3);
    let result = document.querySelectorAll(".result > p > b");
    let time = (Date.now() - date) / 100;
    let hom = document.querySelectorAll(".e b");
    ttime = time + ttime;
    hom[0].innerHTML = matches;
    hom[1].innerHTML = Math.floor(ttime / 60);
    if (e) {
      result[0].innerHTML = Math.floor(time);
      result[1].innerHTML = moves - 1;
      result[2].innerHTML = Math.floor((moves * (time / 10)) / size);
      if (hom[2].innerHTML < Math.floor((moves * (time / 10)) / size)) {
        hom[2].innerHTML = Math.floor((moves * (time / 10)) / size);
      }
    } else {
      result.forEach((v) => {
        v.innerHTML = "---";
      });
    };

  }
};
var move = {
  up: function(i) {
    if (i > size - 1) {
      divs[i - size].insertAdjacentElement("beforebegin", divs[i]);
      divs[i - 1].insertAdjacentElement("afterend", divs[i - size]);
      game.play();
    }
  },
  down: function(i) {
    if (i < (size ** 2) - size) {
      divs[i + Number(size)].insertAdjacentElement("afterend", divs[i]);
      divs[i + 1].insertAdjacentElement("beforebegin", divs[i + Number(size)]);
      game.play();
    }
  },
  right: function(i) {
    if (0 != (i) % size) {
      divs[i - 1].insertAdjacentElement("beforebegin", divs[i]);
      game.play();
    }
  },
  left: function(i) {
    if (0 != (i + 1) % size) {
      divs[i + 1].insertAdjacentElement("afterend", divs[i]);
      game.play();
    };
  }
};
window.onload = function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  let audio = new AudioContext();
  let source = audio.createBufferSource();
  source.connect(audio.destination);
  let request = new XMLHttpRequest();
  request.open('GET', 'Warriyo.mp3', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    audio.decodeAudioData(request.response, function(response) {
      source.buffer = response;
      source.start(0);
      source.loop = true;
      bind.load();
    }, function() { console.log("music error: ??? ")
    bind.load();});
  };
  request.send();
};