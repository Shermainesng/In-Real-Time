import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SliderComp() {
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 1000,
    responsive: [
      // {
      //   breakpoint: 1024,
      //   settings: {
      //     slidesToShow: 2,
      //     slidesToScroll: 1,
      //     arrows: true,
      //     vertical: false,
      //   },
      // },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          vertical: false,
        },
      },
      // {
      //   breakpoint: 480,
      //   settings: {
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //     arrows: true,
      //     vertical: false,
      //   },
      // },
    ],
  };
  return (
    <div>
      <div className="w-2/3 mx-auto">
        <Slider {...settings}>
          <div>
            <div className="carousel-content">
              <h2>Intuitive and easy</h2>
              <p>
                guests can join without any logins, and the setup takes only
                minutes
              </p>
            </div>
          </div>
          <div>
            <div className="carousel-content">
              <h2>Flexible polling options</h2>
              <p>
                with free text and mcq polls, you can engage your guests in a
                variety of ways
              </p>
            </div>
          </div>
          <div>
            <div className="carousel-content">
              <h2>Live polls</h2>
              <p>
                ask what people think or how they feel and get their feedback in
                real time
              </p>
            </div>
          </div>
          <div>
            <div className="carousel-content">
              <h2>Easy to start</h2>
              <p>
                create your polls in seconds and stop guessing what your guests
                really think.
              </p>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}
