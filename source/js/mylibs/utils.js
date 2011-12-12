Wordnik.Utils = {
  addCss: function (css) {
    if (document.createStyleSheet) {
      utils.warn("Encountered IE which does not support dynamic stylesheet addition")
    } else {
      var existingStyles = document.getElementsByTagName('style');
      if (existingStyles.length > 0) {
        var firstStyle = existingStyles[0]
        firstStyle.innerHTML = css + firstStyle.innerHTML
      } else {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
      }
    }
  }
}