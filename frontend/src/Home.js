import React, { useState, useEffect, useRef, useContext } from "react";
import SliderComp from "./shared/components/Slider";
import Button from "./shared/components/FormElements/Button";
export default function Home() {
  return (
    <div>
      <div className="h-screen w-screen relative">
        <div className="bg-pink h-full flex items-center">
          <div className="flex flex-col text-navy-blue w-2/3 mx-auto items-center">
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

        <div className="bg-light-green pb-5">
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

        <div className="bg-brown p-5 text-white">
          <div className="text-6xl ">
            Engage your participants with live polls
          </div>
          <div className="py-3 mb-3">
            Live polls are an easy yet powerful way to spark dialogue, check
            understanding and get instant feedback. Start creating polls and
            find out what people think in real time.
          </div>
          <Button to={"/more"} blue>
            Learn more about live polls
          </Button>
        </div>
      </div>
    </div>
  );
}
