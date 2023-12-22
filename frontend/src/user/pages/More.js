import React from "react";
import BasicAccordion from "../../shared/components/BasicAccordian";
import { TbRosetteNumber1 } from "react-icons/tb";
import { TbRosetteNumber2 } from "react-icons/tb";
import { TbRosetteNumber3 } from "react-icons/tb";

function More() {
  return (
    <div>
      <div className=" w-full">
        <div className="bg-pink h-full flex flex-col items-start">
          <div className="text-navy-blue w-2/3 mx-auto py-4">
            <div className="text-5xl pb-3">
              Easy and flexible online polling for any use case
            </div>
            <p>
              Want to collect ideas before the meeting, do a quick pulse check
              or get feedback after the session? Choose from a wide range of
              poll types you won’t find in your video conferencing tool.
            </p>
          </div>

          <div className="flex w-full flex-col items-center md:w-2/3 mx-auto md:flex-row">
            <div className="">
              <img
                src="/phone.png"
                alt="mockup of phone"
                style={{
                  width: "50vw",
                }}
              />
            </div>

            <div className="w-2/3 mx-auto">
              <BasicAccordion />
            </div>
          </div>
        </div>
        <div className="bg-light-green w-full h-full p-5">
          <div className="text-5xl pb-3 text-navy-blue">How it works</div>
          <div class="grid gap-2 mx-auto">
            <div className="border border-3 py-4 flex flex-column items-center text-navy-blue px-3">
              <TbRosetteNumber1 className="text-2xl bold" />
              <div className="text-bold text-2xl">Create a new event</div>
              <div>
                In the events tab, create a new event. Set the timeframe for
                when you want your event to be active, and give your event a
                name
              </div>
            </div>
            <div className="border border-3 py-4 flex flex-column items-center justify-center text-navy-blue">
              <TbRosetteNumber2 className="text-2xl " />
              <div className="text-bold text-2xl">
                Create polls for your event
              </div>
              <div>
                After creating your event, you can now add polls and ask the
                questions you'd want your guests to answer. You can add MCQ or
                free text polls
              </div>
            </div>
            <div className="border border-3 py-4 flex flex-column items-center justify-center text-navy-blue">
              <TbRosetteNumber3 className="text-lg " />
              <div className="text-bold text-2xl">Launch your poll!</div>
              <div>
                During the event, share the link that is provided on your event
                page. Launch each polls whenever you want during the event, and
                see the results in real time
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple w-full h-full">
          <div>Capture and show results live</div>
          <div>
            Let your participants vote from any device using a link or QR code
            and display the results in real time.
          </div>
        </div>

        <div className="bg-navy-blue">
          <div>Make your next meeting more interactive with live polls.</div>
        </div>
      </div>
    </div>
  );
}

export default More;
