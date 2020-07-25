import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-swipper-test',
  templateUrl: './swipper-test.component.html',
  styleUrls: ['./swipper-test.component.css']
})
export class SwipperTestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var mySwiper = new Swiper('.swiper-container', { 
      spaceBetween: 30,
      centeredSlides: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    mySwiper.prependSlide([
      '<div class="swiper-slide">Slide  A</div>',
      '<div class="swiper-slide">Slide B</div>'
      ]);

      mySwiper.prependSlide([
        '<div class="swiper-slide">Slide C</div>',
        '<div class="swiper-slide">Slide D</div>'
        ]);
  

  }

}
