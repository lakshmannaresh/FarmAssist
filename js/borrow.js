$(function(){

	function showBooks(query){
		if(query){
			query = query.trim();
		}

		searchBook(query, function(data){
			var renderedHTML = renderBooks(data);
			$("#books").html(renderedHTML);
		});
	}

	$("#search").change(function(){
		showBooks($(this).val());
	});

	showBooks();

	$("#list_mode").click(function(){
		$(".list_content").show();
		$(".map_content").hide();
	})

	$("#map_mode").click(function(){
		$(".map_content").show();
		$(".list_content").hide();
	})

	loadMap();
});

function loadMap(){
	var icons = {
	    marker: L.icon({
	      iconUrl: '/vLibrary/img/marker-icon.png',
	      iconRetinaUrl: '/vLibrary/img/marker-icon.png',
	      iconAnchor: [13.5, 17.5],
	      popupAnchor: [0, -11],
	    }),
	    red: L.icon({
	      iconUrl: '/vLibrary/img/red.png',
	      iconRetinaUrl: '/vLibrary/img/red.png',
	      iconSize: [27, 31],
	      iconAnchor: [5, 4],
	      popupAnchor: [0, -11],
	    }),
	    green: L.icon({
	      iconUrl: '/vLibrary/img/green.png',
	      iconRetinaUrl: '/vLibrary/img/green.png',
	      iconSize: [31, 27],
	      iconAnchor: [4, 5],
	      popupAnchor: [0, -11],
	    })
	}

	navigator.geolocation.getCurrentPosition(function(position){
		var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
		L.esri.basemapLayer('Streets').addTo(map);
		L.marker([position.coords.latitude, position.coords.longitude], {
	        icon: icons.marker
	    }).addTo(map);
		searchBook(null, function(books){
			for(var i=0; i<books.length; i++){
				if(books[i].status == 0){
					L.marker([books[i].lat, books[i].lon], {
				        icon: icons.red
				    }).addTo(map);
				}
				else{
					L.marker([books[i].lat, books[i].lon], {
				        icon: icons.green
				    }).addTo(map);
				}
			}
		});
	});
}
function renderBooks(books){
	var renderedHTML = "<div class='list-group'>";
	for(var i=0; i<books.length; i++){
		var status = "<span class='label label-success' style='margin-left:10px;'>Available</span>";
		if(books[i].status == 0){
			status = "<span class='label label-danger' style='margin-left:10px;'>Taken</span>";
		}
		var newHTML = "<a class='list-group-item book'><h4 class='title'>"+books[i].name+status+"</h4><p class='author'><b>Author</b>&nbsp;&nbsp;"+books[i].author+"</p><div class='category'><b>Categories</b>&nbsp;&nbsp;"+books[i].catagory+"</div></a>";
		renderedHTML += newHTML;
	}
	renderedHTML += "</div>";
	return renderedHTML;
}