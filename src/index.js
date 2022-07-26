function getParameter(parameter) {
  let urlString = window.location.href;
  let paramString = urlString.split('?')[1];
  let queryString = new URLSearchParams(paramString);
  for(let pair of queryString.entries()) {
    if(pair[0] == parameter) return pair[1];
  }
  return false;
}


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
      if(data[i].code == 'en') sel.append('<option value="' + data[i].code + '" selected>' + data[i].name + '</option>');
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
    document.forms.state.submit();
  });

  $('#acceptDisclaimer1').on('click', function() {
    document.forms.state.disclaimeraccepted.value = "true";
    $('#exampleModal').modal('hide');
  });

  $('#acceptDisclaimer2').on('click', function() {
    document.forms.state.disclaimeraccepted.value = "true";
    $('#exampleModal').modal('hide');
  });

  console.log(getParameter("disclaimeraccepted"));
  if(getParameter("disclaimeraccepted") == "true") {
    document.forms.state.disclaimeraccepted.value = true;
  }
  else {
    $('#exampleModal').modal('show');
  }

  if(getParameter("keyboard") != "false") {
    document.querySelector("#keyboardSelect").value = getParameter("keyboard");
  }

  keyboardLayout = $("#keyboardSelect").val();

  if (keyboardLayout != 'off' && keyboardLayout != null) {
    let Keyboard = window.SimpleKeyboard.default;
    let KeyboardLayouts = window.SimpleKeyboardLayouts.default;
    let layout = new KeyboardLayouts().get(keyboardLayout);
    let keyboard = new Keyboard({
      onChange: input => onChange(input),
      onKeyPress: button => onKeyPress(button),
      ...layout
    });

    document.querySelector("#translationSource").addEventListener("input", event => {
      keyboard.setInput(event.target.value);
    });
    function onChange(input) {
      document.querySelector("#translationSource").value = input;
      console.log("Input changed", input);
      $('#translationSource').trigger("keyup");
    }

    function onKeyPress(button) {
      console.log("Button pressed", button);
      $('#translationSource').trigger("keyup");
    }
  }
});