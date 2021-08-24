  $(function() {
    $( ".sortable" ).sortable({
      connectWith: ".connectedSortable",
      receive: function( event, ui ) {
        $(this).css({"background-color":"rgb(102, 199, 235);"});
      }
    }).disableSelection();
    $('.add').click(function() {
        var txtNewItem = $('#new_text').val();
        $(this).closest('div.container').find('ul').append('<li class="card">'+txtNewItem+'</li>');
    });    
  });