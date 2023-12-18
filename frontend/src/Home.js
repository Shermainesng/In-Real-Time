import Button from "./shared/components/FormElements/Button";
import React, { useState, useEffect, useRef, useContext } from "react";
import SliderComp from "./shared/components/Slider";

export default function Home() {
  return (
    <div>
      <div className="h-screen w-screen relative">
        <div className="bg-pink h-full flex items-center">
          <div className="flex flex-col text-navy-blue w-2/3 mx-auto">
            <div className="text-6xl pb-3">
              The easiest way to make your events interactive
            </div>
            <p>
              Engage your audience with live polls — for events that are
              happening online or in-person
            </p>
            <Button to={"/events"} yellow>
              get started for free
            </Button>
          </div>
        </div>

        <div className="bg-light-green h-full">
          <div className="flex flex-col mx-auto justify-center items-center text-navy-blue w-2/3 pt-5">
            <div className="text-6xl pb-3">
              It’s how you can include everyone in your events
            </div>
            <p>
              In Real Time gives you everything you need to engage your
              audience, capture their views and make everyone feel connected
            </p>
          </div>

          <SliderComp />
        </div>
      </div>
    </div>
  );
}
