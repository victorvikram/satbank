function getCheckedBoxesOfClass(clss) {
  var selected = [];
  var checkButtons = document.getElementsByClassName(clss);
  $.each(checkButtons, function(i, cb) {
    if(cb.checked) {
      selected.push(cb.id);
    }
  });
  return selected;
}

function addHTMLElements(q, im) {
  var imageLocation = document.getElementById("questions");
  var img=document.createElement('img');
  img.src = "http://localhost:6969/api/question/" + q._id;
  img.id = q._id;
  var li = document.createElement('li');
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.name = "name";
  checkbox.className = "question"
  checkbox.value = "value";
  checkbox.id = q._id;
  var tn = document.createTextNode(q._id);
  li.appendChild(checkbox);
  li.appendChild(tn);
  li.appendChild(img);
  imageLocation.appendChild(li);
}

$(function() {
  var refresh =  document.getElementById("refreshbutton");
  var generate = document.getElementById("generateFromField");
  refresh.addEventListener("click", function(){
    // get all the checked boxes
    var selected = getCheckedBoxesOfClass("tag");
    refreshDisplay(selected);
  });

  generate.addEventListener("click", function() {
    var idBox = document.getElementById("idBox");
    var str = idBox.value;
    var ids = getCheckedBoxesOfClass("question");
    console.log("ids: " + ids);
    ids = ids.concat(str.split(/,| /));
    $.each(ids, function(index, id) {
      if(id === "") {
        ids.splice(index, 1);
      }
    });
    console.log(ids);
  });

});

function refreshDisplay(selected) {
  var urlTail = ''
  $.each(selected, function(i, t) {
    urlTail += t;
    urlTail += '&';
  });
  urlTail = urlTail.slice(0, -1);
  $.ajax({
    type: 'GET',
    url: 'http://localhost:6969/api/questions?' + urlTail,
    success: function(response) {
      console.log(response.data);
      $.each(response.data, function(i, q) {
            addHTMLElements(q);
      });
    }
  });
}
