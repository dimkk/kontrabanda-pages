(function (window, document, tagName, source, counterId) {
  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();

  var firstScript = document.getElementsByTagName(tagName)[0];
  var script = document.createElement(tagName);
  script.async = true;
  script.src = source;
  firstScript.parentNode.insertBefore(script, firstScript);

  window.ym(counterId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false
  });
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", 113106709);
