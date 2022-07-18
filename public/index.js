function generateKeyboard(layout = false) {
  const Keyboard = window.SimpleKeyboard.default;
  const defaultTheme = "hg-theme-default";

  if(layout) {
    const KeyboardLayouts = window.SimpleKeyboardLayouts.default;
    const layout = new KeyboardLayouts().get(layout);
    const myKeyboard = new Keyboard({
      onChange: input => onChange(input),
      onKeyPress: button => onKeyPress(button),
      ...layout
    });
  } else {
    const myKeyboard = new Keyboard({
      onChange: input => onChange(input),
      onKeyPress: button => onKeyPress(button)
    });
  }
  
  function onChange(input) {
    document.querySelector(".input").value = input;
    console.log("Input changed", input);
  }
  
  function onKeyPress(button) {
    console.log("Button pressed", button);
  }
  
  function showKeyboard() {
    console.log("showKeyboard");
    myKeyboard.setOptions({
      theme: `${defaultTheme} show-keyboard`
    });
  }
  
  function hideKeyboard() {
    console.log("hideKeyboard");
    myKeyboard.setOptions({
      theme: defaultTheme
    });
  }
}

generateKeyboard();
hideKeyboard();

$(document).ready(function(){


  $.get("/languages",
  function(data) {
    var sel = $("#sourceLanguage");
    sel.empty();
  for (var i=0; i<data.length; i++) {
      if(data[i].code == 'de') sel.append('<option value="' + data[i].code + '" selected>' + data[i].name + '</option>');
      else sel.append('<option value="' + data[i].code + '">' + data[i].name + '</option>');
    }
    var sel = $("#targetLanguage");
    sel.empty();
    for (var i=0; i<data.length; i++) {
      if(data[i].code == 'es') sel.append('<option value="' + data[i].code + '" selected>' + data[i].name + '</option>');
      else sel.append('<option value="' + data[i].code + '">' + data[i].name + '</option>');
    }
  }, "json");

  $('#translationSource').on('keyup', function() {
    $.ajax({
      url: "/translate"
      , context: document.body
      , method: 'POST'
      , data: {
        'q' : $('#translationSource').val()
        , source: $('#sourceLanguage').val()
        , target: $('#targetLanguage').val()
        , format: 'html'
      }
    }).done(function(data) {
      $('#translationTarget').val(data.translatedText);
    });
  });

  $('#keyboardSelect').on('change', function() {
    keyboardSelectValue = $('#keyboardSelect').val();
    console.log("keyboardSelect changed: "+keyboardSelectValue);
    if(keyboardSelectValue == "off") {
      hideKeyboard();
    }
    else if (keyboardSelectValue == "default") {
      hideKeyboard();
      generateKeyboard();
    }
    else {
      hideKeyboard();
      generateKeyboard(keyboardSelectValue);
    }
  });
});