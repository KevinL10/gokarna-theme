document.addEventListener('DOMContentLoaded', ready, false);

const THEME_PREF_STORAGE_KEY = "theme-preference";
const THEME_TO_ICON_CLASS = {
    'dark': 'feather-moon',
    'light':'feather-sun'
};
let toggleIcon = '';
let darkThemeCss = '';

function ready() {
    feather.replace({ 'stroke-width': 1, width: 20, height: 20 });
    setThemeByUserPref();

    if (document.querySelector('main#content > .container').classList.contains('post')) {
        buildToc();
        addSmoothScroll();
        createScrollSpy();
    }

    // Elements to inject
    const svgsToInject = document.querySelectorAll('img.svg-inject');
    // Do the injection
    SVGInjector(svgsToInject);

    document.getElementById('hamburger-menu-toggle').addEventListener('click', () => {
        const hamburgerMenu = document.getElementsByClassName('nav-hamburger-list')[0]
        if (hamburgerMenu.classList.contains('visibility-hidden')) {
            hamburgerMenu.classList.remove('visibility-hidden');
        } else {
            hamburgerMenu.classList.add('visibility-hidden');
        }
    })
}

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 820) {
        // For smaller screen, show shadow earlier
        toggleHeaderShadow(50);
    } else {
        toggleHeaderShadow(100);
    }
});

function buildToc() {
    const tocUL = document.querySelector('#toc > .post-toc-content');
    document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4').forEach($heading => {

      //create id from heading text
      var id = $heading.getAttribute("id") || $heading.innerText.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/ +/g, '-');

      //add id to heading
      $heading.setAttribute('id', id);

      //append parent class to heading
      $heading.classList.add('anchor-heading');

      //create anchor
      $anchor = document.createElement('a');
      $anchor.className = 'anchor-link';
      $anchor.href = '#' + id;
      $anchor.innerText = $heading.innerText;

      //create li element
      $li = document.createElement('li');
      $li.appendChild($anchor);
      switch($heading.tagName) {
        case 'H1':
          $li.className = 'level-1';
          break;
        case 'H2':
          $li.className = 'level-2';
          break;
        case 'H3':
          $li.className = 'level-3';
          break;
        case 'H4':
          $li.className = 'level-4';
          break;
      }

      tocUL.appendChild($li);
    });
}

function addSmoothScroll() {
    document.querySelectorAll('#toc a').forEach($anchor => {
        $anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'start' //scroll to top of the target element
            });
        });
    });
}

function createScrollSpy() {
    var elements = document.querySelectorAll('#toc a');
    document.addEventListener('scroll', function () {
        elements.forEach(function (element) {
          const boundingRect = document.querySelector(element.getAttribute('href')).getBoundingClientRect();
          if (boundingRect.top <= 55 && boundingRect.bottom >= 0) {
            elements.forEach(function (elem) {
              elem.classList.remove('active');
            });
            element.classList.add('active');
          }
        });
    });
}

function toggleHeaderShadow(scrollY) {
    if (window.scrollY > scrollY) {
        document.querySelectorAll('.header').forEach(function(item) {
            item.classList.add('header-shadow')
        })
    } else {
        document.querySelectorAll('.header').forEach(function(item) {
            item.classList.remove('header-shadow')
        })
    }
}

function setThemeByUserPref() {
    darkThemeCss = document.getElementById("dark-theme");
    const savedTheme = localStorage.getItem(THEME_PREF_STORAGE_KEY) || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark': 'light');
    const darkThemeToggles = document.querySelectorAll('.dark-theme-toggle');
    setTheme(savedTheme, darkThemeToggles);
    darkThemeToggles.forEach(el => el.addEventListener('click', (event) => {
        toggleIcon = event.currentTarget.querySelector("a svg.feather");
        if (toggleIcon.classList[1] === THEME_TO_ICON_CLASS.dark) {
            setTheme('light', [event.currentTarget]);
        } else if (toggleIcon.classList[1] === THEME_TO_ICON_CLASS.light) {
            setTheme('dark', [event.currentTarget]);
        }
    }));
}

function setTheme(themeToSet, targets) {
    localStorage.setItem(THEME_PREF_STORAGE_KEY, themeToSet);
    darkThemeCss.disabled = themeToSet === 'light';
    targets.forEach((target) => {
            target.querySelector('a').innerHTML = feather.icons[THEME_TO_ICON_CLASS[themeToSet].split('-')[1]].toSvg();
    });
}

