import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  List,
  ListItem,
  ButtonBase,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ISort {
  sortOption: string;
  onSortChange: (option: string) => void;
}

const Sorting = ({ sortOption, onSortChange }: ISort) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Sort by</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <ListItem>
            <ButtonBase
              onClick={() => onSortChange("createdAt")}
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Checkbox checked={sortOption === "createdAt"} />
              <Typography>Date of Creation</Typography>
            </ButtonBase>
          </ListItem>
          <ListItem>
            <ButtonBase
              onClick={() => onSortChange("dispatchDate")}
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Checkbox checked={sortOption === "dispatchDate"} />
              <Typography>Date of Sending</Typography>
            </ButtonBase>
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default Sorting;
