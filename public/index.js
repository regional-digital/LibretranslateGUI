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
        , api_key: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      }
    }).done(function(data) {
      $('#translationTarget').val(data.translatedText);
    });
  });

});