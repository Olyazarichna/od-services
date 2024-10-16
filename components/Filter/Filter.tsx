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

interface ICityFilter {
    title: string;
    cities: string[];
    selectedCities: string[];
    onCityChange: (city: string) => void;
}

const Filter = ({
    title,
    cities,
    selectedCities,
    onCityChange,
}: ICityFilter) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {cities.map((city) => (
                        <ListItem key={city}>
                            <ButtonBase
                                onClick={() => onCityChange(city)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                }}
                            >
                                <Checkbox checked={selectedCities.includes(city)} />
                                <Typography>{city}</Typography>
                            </ButtonBase>
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    );
};

export default Filter;
