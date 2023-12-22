import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function BasicAccordion() {
  const questrialFont = {
    fontFamily: "Questrial, sans-serif",
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={questrialFont}>Multiple Choice</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={questrialFont}>
            Discover your audience’s opinions, preferences and knowledge. With
            multiple choice polls, people vote on predefined options and you can
            quickly see the prevailing answer.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography sx={questrialFont}>Free Text</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={questrialFont}>
            Let your participants type in their own answer or comment. Open text
            polls are great for feedback surveys and training sessions, or as a
            collaboration tool in small meetings.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
