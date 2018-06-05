function searchToggle(obj, evt){
  var container = $(obj).closest('.search-wrapper');
    if(!container.hasClass('active')){
        container.addClass('active');
        evt.preventDefault();
    }
    else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
        container.removeClass('active');
        // clear input
        container.find('.search-input').val('');
    }
}

function search() {
  var input, filter, searchList, searchItem, a;
  input     = document.getElementById('searchInput');
  filter    = input.value;
  searchList= document.getElementsByClassName('searchList');
  for (let i = 0; i < searchList.length; i++) {
    a = searchList[i].getElementsByClassName("detail-name")[0];
    if (a.innerHTML.indexOf(filter) > -1) {
      searchList[i].style.display = "";
    } else {
      searchList[i].style.display = "none";
    }
  };
};