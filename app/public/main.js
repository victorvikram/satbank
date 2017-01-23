$(function() {

  var checkboxes = document.getElementsByClassName("input");

  var refresh =  document.getElementById("refreshbutton");
  refresh.addEventListener("click", function(){
    // get all the checked boxes
    var checkButtons = document.getElementsByClassName("input");
    var selected = [];
    $.each(checkButtons, function(i, cb) {
      if(cb.checked) {
        selected.push(cb.id);
        console.log(cb.id + "\n");
      }
    });
    console.log(selected);
    refreshDisplay(selected);
  });

  console.log("running javascript");

});

function refreshDisplay() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:6969/api/questions?algebra',
    success: function(response) {
      console.log(response.data);
      var imageLocation = document.getElementById("questions");
      $.each(response.data, function(i, q) {
        $.ajax({
          type: 'GET',
          url: 'http://localhost:6969/api/question/' + q._id,
          success: function(im) {
            addHTMLElements(q, im);
          }
        });
      });
    }
  });
}

function addHTMLElements(q, im) {
  var img=document.createElement('img');
  img.src = im;
  img.id = q._id;
  var li = document.createElement('li');
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.name = "name";
  checkbox.value = "value";
  checkbox.id = "id";
  var tn = document.createTextNode(q._id);
  li.appendChild(checkbox);
  li.appendChild(tn);
  li.appendChild(img);
  imageLocation.appendChild(li);
}
