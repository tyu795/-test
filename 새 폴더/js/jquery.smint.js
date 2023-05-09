/*

SMINT V1.0 by Robert McCracken
SMINT V2.0 by robert McCracken with some awesome help from Ryan Clarke (@clarkieryan) and mcpacosy ‏(@mcpacosy)
SMINT V3.0 by robert McCracken with some awesome help from Ryan Clarke (@clarkieryan) and mcpacosy ‏(@mcpacosy)

SMINT is my first dabble into jQuery plugins!

http://www.outyear.co.uk/smint/

If you like Smint, or have suggestions on how it could be improved, send me a tweet @rabmyself

*/


(function(){


	$.fn.smint = function( options ) {

		var settings = $.extend({
			'scrollSpeed'  : 500,
			'mySelector'     : 'div'
		}, options);

		// adding a class to users div
		$(this).addClass('smint');


				
		
		//Set the variables needed
		var optionLocs = new Array(),
			lastScrollTop = 0,
			menuHeight = $(".smint").height(),
			smint = $('.smint'),
        	smintA = $('.smint a'),
        	myOffset = smint.height();

      



		if ( settings.scrollSpeed ) {
				var scrollSpeed = settings.scrollSpeed
			}

		if ( settings.mySelector ) {
				var mySelector = settings.mySelector
		};



		return smintA.each( function(index) {
            
			var id = $(this).attr('href').split('#')[1];

			if (!$(this).hasClass("extLink")) {
				$(this).attr('id', id);
			}

			
			//Fill the menu
			optionLocs.push(Array(
				$(mySelector+"."+id).position().top-menuHeight, 
				$(mySelector+"."+id).height()+$(mySelector+"."+id).position().top, id)
			);

			///////////////////////////////////

			// get initial top offset for the menu 
			var stickyTop = smint.offset().top;	

			// check position and make sticky if needed
			var stickyMenu = function(direction){

				// current distance top
				var scrollTop = $(window).scrollTop()+myOffset; 

				// if we scroll more than the navigation, change its position to fixed and add class 'fxd', otherwise change it back to absolute and remove the class
				if (scrollTop > stickyTop+myOffset) { 
					smint.css({ 'position': 'fixed', 'top':0,'left':0 }).addClass('fxd');

					// add padding to the body to make up for the loss in heigt when the menu goes to a fixed position.
					// When an item is fixed, its removed from the flow so its height doesnt impact the other items on the page
					$('body').css('padding-top', menuHeight );	
				} else {
					smint.css( 'position', 'relative').removeClass('fxd'); 
					//remove the padding we added.
					$('body').css('padding-top', '0' );	
				}   

				// Check if the position is inside then change the menu
				// Courtesy of Ryan Clarke (@clarkieryan)
				if(optionLocs[index][0] <= scrollTop && scrollTop <= optionLocs[index][1]){	
					if(direction == "up"){
						$("#"+id).addClass("active");
						$("#"+optionLocs[index+1][2]).removeClass("active");
					} else if(index > 0) {
						$("#"+id).addClass("active");
						$("#"+optionLocs[index-1][2]).removeClass("active");
					} else if(direction == undefined){
						$("#"+id).addClass("active");
					}
					$.each(optionLocs, function(i){
						if(id != optionLocs[i][2]){
							
							$("#"+optionLocs[i][2]).removeClass("active");
						}
					});
				}
			};

			// run functions
			stickyMenu();

			// run function every time you scroll
			$(window).scroll(function() {
				//Get the direction of scroll
				var st = $(this).scrollTop()+myOffset;
				if (st > lastScrollTop) {
				    direction = "down";
				} else if (st < lastScrollTop ){
				    direction = "up";
				}
				lastScrollTop = st;
				stickyMenu(direction);

				// Check if at bottom of page, if so, add class to last <a> as sometimes the last div
				// isnt long enough to scroll to the top of the page and trigger the active state.

				if($(window).scrollTop() + $(window).height() == $(document).height()) {
	       			smintA.removeClass('active')
	       			$(".smint a:not('.extLink'):last").addClass('active')
	       			
   				} else {
   					smintA.last().removeClass('active')
   				}
			});

			///////////////////////////////////////
        
        	$(this).on('click', function(e){
				// gets the height of the users div. This is used for off-setting the scroll so the menu doesnt overlap any content in the div they jst scrolled to
				var myOffset = smint.height();   

        		// stops hrefs making the page jump when clicked
				e.preventDefault();
				
				// get the hash of the button you just clicked
				var hash = $(this).attr('href').split('#')[1];

				

				var goTo =  $(mySelector+'.'+ hash).offset().top-myOffset;
				
				// Scroll the page to the desired position!
				$("html, body").stop().animate({ scrollTop: goTo }, scrollSpeed);
				
				// if the link has the '.extLink' class it will be ignored 
		 		// Courtesy of mcpacosy ‏(@mcpacosy)
				if ($(this).hasClass("extLink"))
                {
                    return false;
                }

			});	


			//This lets yo use links in body text to scroll. Just add the class 'intLink' to your button and it will scroll

			$('.intLink').on('click', function(e){
				var myOffset = smint.height();   

				e.preventDefault();
				
				var hash = $(this).attr('href').split('#')[1];

				if (smint.hasClass('fxd')) {
					var goTo =  $(mySelector+'.'+ hash).position().top-myOffset;
				} else {
					var goTo =  $(mySelector+'.'+ hash).position().top-myOffset*2;
				}
				console.log($("s".hash))
				
				$("html, body").stop().animate({ scrollTop: goTo }, scrollSpeed);

				if ($(this).hasClass("extLink"))
                {
                    return false;
                }

			});	
		});

	};
	// 메인 슬라이드
	$(function(){

		//  첫번째 이미지가 보여지는 상태로 세팅
		$(".section.sTop.wrap ul li").hide();
		$(".section.sTop.wrap ul li").first().show();
	
	
	
		// setInterval(함수, 반복 실행 간격 밀리초);
		setInterval(function(){
	
			$(".section.sTop.wrap ul").append( $(".section.sTop.wrap ul li").first() );
			// #wrap ul 내부에 첫번째 li을 가져가 맨 뒤에 삽입한다.(밀어내면서 순서가 바뀌게 된다.)
	
			$(".section.sTop.wrap ul li").last().hide();
			// #wrap ul li 중 마지막 요소를 가려줌
	
			$(".section.sTop.wrap ul li").first().fadeIn();
			// #wrap ul li 중 첫번째 요소를 서서히 나타낸다.
			// 첫번째 요소가 계속해서 바뀌기 때문에 보여질 때 순서가 바뀌면서 보여지는 원리
	
		}, 2000);
	
		// 음식 팝업창
		$(function(){

			$(".popup_btn").click(function(){
		
				$(".food_box").fadeIn();
		
		
		
			});
		
			$(".cancel_btn").click(function(){
	
				$(".food_box").fadeOut();
		
			});
		});
	
	// 어바웃 슬라이드
	$(function(){

		// 변수 선언
		var container = 900;    // 컨테이너 박스의 너비
		var display = 3;        // 아이템이 보여질 개수
		var itemWidth = container  / display;    // 각 아이템(이미지)의 너비값을 전체너비값에서 보여지는 개수를 나누어 item에 저장(800/5 = 160)
		var count = $(".item").length;  // 총 이미지의 개수
		var slideBox = itemWidth * count;   // 전체 모든 이미지들을 감싸주는 박스의 너비값(.slider)
		// 이 박스가 움직임을 담당해주는 박스가 될 것임
		// 이미지의 너비 * 이미지의 개수
	
	
	
		// 세팅
		$(".center").css("width", center);
		$(".about").css("width", slideBox);
		$(".item").css("width", itemWidth);
	
	
		// 이전, 다음 버튼을 판단하는 함수 및 클릭 이벤트
		function moveSlider() {
	
			var btnCheck = $(this).attr("data-btn");
			// data-btn의 값에 따라 prev(0), next(1)을 결정, btnCheck변수에 저장
			// console.log(btnCheck);
	
			if(btnCheck == 0) { //이전 버튼을 클릭하면
	
				$(".about").animate({
					left : "+=" + itemWidth
					// left값을 아이템의 너비만큼 계속 누적시킨다.
				}, 300, slideEnd);
				
			} else {
	
				$(".about").animate({
					left : "-=" + itemWidth
				}, 300, slideEnd);
			}
		}
	
		$(".next, .prev").click(moveSlider);
		
	
	
		// 슬라이드 끝에 도달했을 때 실행 이벤트
		function slideEnd() {
	
			var nowLeft = $(".about").position().left;
			// 선택자.position() : 요소의 포지션값을 반환 메서드(부모위치를 기준으로 반환)
			// 선택자.position().left;
			// 선택자.position().top;
			// 선택자.offset() : 요소의 절대좌표 반환 메서드(페이지 기준)
			// 선택자.offset().left;
	
			console.log(nowLeft);
	
			var end = - (slideBox - center);
			// 안쪽에 있는 전체 이미지를 감싸고 있는 너비값(.slider)에서 보여지는 너비값(.container)를 빼고 -를 붙임
			// 현재 end는 - (1600 - 800) = -800
	
	
			if(nowLeft <= end) {
				// 현재 슬라이더의 위치값이 end(-800)보다 작거나 같은 경우(마지막 슬라이드에 도달했을 때)
	
				$(".about").animate({left: end});
				// 슬라이더의 left값을 다시 end로 지정
				// 마지막 슬라이드에 왔을 때 next버튼을 또 누르면 다시 left값을 -800으로 고정시키면서 값을 재지정해 튀는듯한 효과를 준다.
	
			} else if(nowLeft > 0) {
				// 현재 슬라이더의 위치값이 0보다 큰 경우(첫번째 슬라이드에 도달했을 때) 이전 버튼을 한번 더 누르면 값이 0보다 커짐. left값을 다시 0으로 재지정해서 처음 슬라이드의 위치로 돌아온다.            
	
				$(".about").animate({left: 0});
			}
		}
	
	
	});





	
	});

	$.fn.smint.defaults = { 'scrollSpeed': 500, 'mySelector': 'div'};
})(jQuery);