var geocoder;
var product_images;

$(document).ready(function(){
	var url = '/json/product_images.json';
	var data = {};
	$.ajax({
		dataType: "json",
		type: 'GET',
		url: url,
		formatData: false,
		error: function(e){
			console.log('error');
		},
		success: function(req){
			product_images = new Object();
			$.each(req, function(index,el){
				product_images[index] = el;
				var products = $('#products');
				if(products && products.length > 0){
					var prodDiv = $('#template_product').html();
					regex = new RegExp("{img}", 'g');
					prodDiv = prodDiv.replace(regex, el);
					regex = new RegExp("{name}", 'g');
					prodDiv = prodDiv.replace(regex, index);
					$('#products').append(prodDiv);
				}
			});
			var products = $('#products');
			if(products && products.length > 0){
				addItemLinks();
			}
		}
	});
	
	if($('.product_farms').length > 0){
		url = '/api/product_detail';
		data = {};
		$.ajax({
			dataType: "json",
			type: 'GET',
			url: url,
			formatData: false,
			error: function(e){
				console.log('error');
			},
			success: function(req){
                console.log('got product_detail',req);
				var prod = req.productDetail;
				var prodDiv = $('#template_product').html();
				var regex = new RegExp("{name}", 'g');
				prodDiv = prodDiv.replace(regex, prod.name);
				regex = new RegExp("{img}", 'g');
				if(typeof product_images[prod.name] == 'string'){
					prodDiv = prodDiv.replace(regex, product_images[prod.name]);
				}
				else {
					prodDiv = prodDiv.replace(regex, product_images['blank']);
				}
				
				$('.row.product').append(prodDiv);
				
				$.each(prod.farms, function(index, el){
					renderFarmList(el, $('.product_farms'));
				});
				var prodHtml = $('.product_farms').html();
				regex = new RegExp("{productName}", 'g');
				prodHtml = prodHtml.replace(regex, prod.name);
				
				$('.product_farms').html(prodHtml);
				addItemLinks();
			}
		});
	}
	if($('#farm').length > 0){
		var list, hash;
		if(window.location.hash !== ''){
			hash = window.location.hash.replace('#', '');
			url = '/api/farm~/' + hash;
			list = true;
		}else{
			url = '/api/farm~';
            list = false;
        }
		data = {};
		$.ajax({
			dataType: "json",
			type: 'GET',
			url: url,
			formatData: false,
			error: function(e){
				console.log('error');
			},
			success: function(req){
                console.log('got farm',hash,req);
				var farmer;
				if(list){
                    farmer = req;
				} else {
					farmer = req.farmer;
				}
				
				renderFarm(farmer, $('#farm'));
				addItemLinks();
				loadMap($('#farm').find('.map'));
			}
		});
	}
	if($('#farms').length > 0){
		url = '/api/farm~';
		data = {};
		$.ajax({
			dataType: "json",
			type: 'GET',
			url: url,
			formatData: false,
			error: function(e){
				console.log('error');
			},
			success: function(req){
                console.log('got farms',req);
				var farmers = req;
				
				$.each(farmers, function(index, farmer){
					renderFarmList(farmer, $('#farms'));
				});
			}
		});
	}
	if($('#shopping_list').length > 0){
		url = '/api/user';
		data = {};
		$.ajax({
			dataType: "json",
			type: 'GET',
			url: url,
			formatData: false,
			error: function(e){
				console.log('error');
			},
			success: function(r){
                console.log('got user profiles',r);
                var req = r[0];
				var favorites = new Array();
				$.each(req.farms, function(index, el){
					if(el.isFavorite === true){
						favorites.push(el.slug);
					}
				});
				$.each(req.shoppingList, function(index, el){
					var shedDiv = $('#template_shed').html();
					regex = new RegExp("{shed}", 'g');
					shedDiv = shedDiv.replace(regex, index);
					var temp = $('<div/>');
					$.each(el, function(in2, farm){
						var farmDiv = $('#template_farmer').html();
						regex = new RegExp("{name}", 'g');
						farmDiv = farmDiv.replace(regex, farm.name);
						regex = new RegExp("{stall}", 'g');
						farmDiv = farmDiv.replace(regex, farm.stall);
						regex = new RegExp("{favorite}", 'g');
						if($.inArray(farm.slug, favorites)){
							farmDiv = farmDiv.replace(regex, 'on');
						}
						else {
							farmDiv = farmDiv.replace(regex, '');
						}
						var temp2 = $('<div/>');
						var id = 0;
						$.each(farm.products, function(in3, product){
							var prodDiv = $('#template_product').html();
							regex = new RegExp("{id}", 'g');
							prodDiv = prodDiv.replace(regex, id);
							regex = new RegExp("{name}", 'g');
							prodDiv = prodDiv.replace(regex, in3);
							regex = new RegExp("{checked}", 'g');
							if(product === false){
								prodDiv = prodDiv.replace(regex, ' ');
							}
							else {
								prodDiv = prodDiv.replace(regex, ' checked');
							}
							temp2.append(prodDiv);
							id++;
						});
						regex = new RegExp("{product}", 'g');
						farmDiv = farmDiv.replace(regex, temp2.html());
						temp.append(farmDiv);
					});
					regex = new RegExp("{farmers}", 'g');
					shedDiv = shedDiv.replace(regex, temp.html());
					$('#shopping_list').append(shedDiv);
				});
			}
		});
	}
});

function addItemLinks(){
	$('.addtolist').on('click', function(e){
		e.preventDefault();
		var link = this;
		setTimeout(function(){
			addItem(link);
		}, 500);
	});
}

function addItem(obj){
	var notice = $('<div id="notice">'+$(obj).attr('href').replace('#', '')+' added to your shopping list!</div>');
	$(document.body).append(notice);
	notice.css('top', $('header.main').outerHeight());
	notice.hide();
	notice.slideDown(500).delay(3000).slideUp(500, function(){$(this).remove()});
}

function loadMap(obj){
	var myDiv = $(obj)[0];
	if($(obj).attr('addr') != ''){
		var address = $(obj).attr('addr');
		geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var mapOptions = {center: results[0].geometry.location, zoom: 10, mapTypeId: google.maps.MapTypeId.ROADMAP};
				var map = new google.maps.Map(myDiv, mapOptions);
				var marker = new google.maps.Marker({
		            map: map,
		            position: results[0].geometry.location
		        });
			}
	    });
	}
	if($(obj).attr('lat') != '' && $(obj).attr('lng') != ''){
		var myPoint = new google.maps.LatLng(parseFloat($(obj).attr('lat')), parseFloat($(obj).attr('lng')));
		var mapOptions = {center: myPoint, zoom: 10, mapTypeId: google.maps.MapTypeId.ROADMAP};
		var map = new google.maps.Map(myDiv, mapOptions);
		var marker = new google.maps.Marker({
            map: map,
            position: myPoint
        });
	}
}

$(window).load(function(){
	$('.map').each(function(){
		loadMap(this);
	});
	$('#mobile_menu').click(function(e){
		e.preventDefault();
		$('nav.mobile').toggle();
	});
});

function renderFarmList(farmer, obj){
	var farmDiv = $('#template_farm').html();
					
	$.each(farmer, function(in2, el2){
		var regex = new RegExp("{"+in2.toString()+"}", 'g');
		farmDiv = farmDiv.replace(regex, el2.toString());
	});
	rank = Math.round(farmer.aggregateRating);
	rankSpan = '';
	for(i=0; i<5; i++){
		if(i < rank){
			rankSpan+= '<span class="on">&#9733;</span>';
		}
		else {
			rankSpan+= '<span>&#9733;</span>';
		}
	}
	var regex = new RegExp("{rank}", 'g');
	farmDiv = farmDiv.replace(regex, rankSpan);
	
	if(typeof farmer.isFavorite == 'boolean'){
		if(farmer.isFavorite){
			regex = new RegExp("{favorite}", 'g');
			farmDiv = farmDiv.replace(regex, 'on');
		} else {
			regex = new RegExp("{favorite}", 'g');
			farmDiv = farmDiv.replace(regex, '');
		}
	}
	else {
		regex = new RegExp("{favorite}", 'g');
		farmDiv = farmDiv.replace(regex, '');
	}
	
	if(typeof farmer.marketDayBooth == 'object'){
		regex = new RegExp("{shed}", 'g');
		farmDiv = farmDiv.replace(regex, farmer.marketDayBooth ? farmer.marketDayBooth.shed : '{shed}');
		
		regex = new RegExp("{stall}", 'g');
		farmDiv = farmDiv.replace(regex, farmer.marketDayBooth ? farmer.marketDayBooth.stall : '{stall}');
	}
	
	obj.append(farmDiv);
}

function renderFarm(farmer, obj){
	var farmDiv = $('#template_farmer').html();
				
	$.each(farmer, function(index, el){
		var regex = new RegExp("{"+index.toString()+"}", 'g');
		farmDiv = farmDiv.replace(regex, el);
	});
	rank = Math.round(farmer.aggregateRating);
	rankSpan = '';
	for(i=0; i<5; i++){
		if(i < rank){
			rankSpan+= '<span class="on">&#9733;</span>';
		}
		else {
			rankSpan+= '<span>&#9733;</span>';
		}
	}
	var regex = new RegExp("{rank}", 'g');
	farmDiv = farmDiv.replace(regex, rankSpan);
	
	regex = new RegExp("{marketDayBooth.shed}", 'g');
	farmDiv = farmDiv.replace(regex, farmer.marketDayBooth ? farmer.marketDayBooth.shed : '{shed}');
	
	regex = new RegExp("{marketDayBooth.stall}", 'g');
	farmDiv = farmDiv.replace(regex, farmer.marketDayBooth ? farmer.marketDayBooth.stall : '{stall}');
	
	var imgCount = 0;
	var temp = $('<div/>');
	$.each(farmer.photoImages, function(index, el){
		var pic = $('<div class="threecol"><img src="'+el+'"/></div>');
		imgCount++;
		if(imgCount < 4){
			temp.append(pic);
		}
		if(imgCount == 3){
			pic.addClass('last');
		}
	});
	regex = new RegExp("{photos}", 'g');
	farmDiv = farmDiv.replace(regex, temp.html());
	
	var temp = $('<div/>');
	if (farmer.marketDayBooth) {
		$.each(farmer.marketDayBooth.sellSheet, function(index, el){
			var prodDiv = $('#template_product').html();
			regex = new RegExp("{name}", 'g');
			prodDiv = prodDiv.replace(regex, index);
			regex = new RegExp("{img}", 'g');
	        if(product_images){
	            if(typeof product_images[index] == 'string'){
	                prodDiv = prodDiv.replace(regex, product_images[index]);
	            }
	            else {
	                prodDiv = prodDiv.replace(regex, product_images['blank']);
	            }
	        }
			if(typeof el.price != 'undefined' && typeof el.units != 'undefined'){
				var priceUnits = '$'+el.price+'/'+el.units;
				regex = new RegExp("{priceUnits}", 'g');
				prodDiv = prodDiv.replace(regex, priceUnits);
			}
			else {
				regex = new RegExp("{priceUnits}", 'g');
				prodDiv = prodDiv.replace(regex, '');
			}
			temp.append(prodDiv);
		});
	}
	regex = new RegExp("{products}", 'g');
	farmDiv = farmDiv.replace(regex, temp.html());
	
	obj.append(farmDiv);
}
