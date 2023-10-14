$$(function(){

  let mainSlide = $$("#slideMain");

  if(mainSlide.length > 0){

    Utilities.slideBlockUnique({
      contSlide: mainSlide.find(".contSlide"),
      contItemsSlide: mainSlide.find(".contElemSlide"),
      itemsSlide: mainSlide.find(".contElemSlide li"),
      prevBtn: mainSlide.find(".prev"),
      nextBtn: mainSlide.find(".next"),
      playBtn: mainSlide.find(".play"),
      stopBtn: mainSlide.find(".stop"),
      contDiscs: mainSlide.find(".circles"),
      animateSlide: "enable",
      timeTransition: 4000
    });
  }


  $$(".contAnuncios").animate({opacity: 1},{duration: 3000});
  $$("#slideMain").animate({opacity: 1},{duration: 3000});


  (function settingsFormattedPrices() {

    let products = $$('.product_price, .price');

    products.map(function(k,v) {

      let value = $$(v).text().replace('R$','');
      let integer = value.split('.')[0];
      let decimal = value.split('.')[1];

      if(value > 999.99) {
        let slice1 = integer.substring(integer.length - 3, 0);
        let slice2 = integer.substring(integer.length, integer.length - 3);

        integer = slice1+'.'+slice2;
      }

      value = 'R$' + integer + ( decimal ? ',<span style="font-size: .75em">'+decimal+'</span>' : ',<span style="font-size: .75em">00</span>' );

      $$(v).html(value);
    });

  }());


});