import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { ConfirmModal } from "../ComfirmModal/ConfirmModal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IRequestList } from "../../utils/types";
import Filter from "../Filter/Filter";
import Sorting from "../Sorting/Sorting";

interface Request {
  idOrder: string;
  fromCity: string;
  toCity: string;
  parcelType?: string;
  dispatchDate: string;
  createdAt: string;
  description?: string;
  isDeliverRequest?: boolean;
  idUser: string;
}

const RequestList = ({ showAllRequests }: IRequestList) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [sortOption, setSortOption] = useState("createdAt");
  const [currentOrder, setCurrentOrder] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditable, setIsEditable] = useState<string | null>(null);
  const [fromCityFilter, setFromCityFilter] = useState<string[]>([]);
  const [toCityFilter, setToCityFilter] = useState<string[]>([]);
  const [matchingRequests, setMatchingRequests] = useState<Request[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const handleOpen = (id: string) => {
    setCurrentOrder(id);
    setOpen(true);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const idUser = user.id;
    setLoggedInUser(idUser);

    const savedOrder = localStorage.getItem("orderRequests");
    const savedDeliver = localStorage.getItem("deliverRequests");

    let orderRequests: Request[] = [];
    let deliverRequests: Request[] = [];

    if (savedOrder) {
      try {
        orderRequests = JSON.parse(savedOrder);
      } catch (error) {
        console.error("Error parsing order requests from localStorage", error);
      }
    }

    if (savedDeliver) {
      try {
        deliverRequests = JSON.parse(savedDeliver);
      } catch (error) {
        console.error(
          "Error parsing deliver requests from localStorage",
          error
        );
      }
    }

    const combinedRequests = [...orderRequests, ...deliverRequests];

    if (!showAllRequests) {
      const userRequests = combinedRequests.filter(
        (request) => request.idUser === idUser
      );
      setRequests(userRequests);

      const findMatches = (userRequests: Request[], allRequests: Request[]) => {
        return userRequests
          .map((userRequest) => {
            const matches = allRequests.filter((otherRequest) => {
              return (
                otherRequest.fromCity === userRequest.fromCity &&
                otherRequest.toCity === userRequest.toCity &&
                new Date(otherRequest.dispatchDate) <=
                  new Date(userRequest.dispatchDate) &&
                otherRequest.idUser !== userRequest.idUser
              );
            });
            return matches;
          })
          .flat();
      };
      const matches = findMatches(userRequests, combinedRequests);
      setMatchingRequests(matches);
    } else {
      setRequests(combinedRequests);
    }
  }, [showAllRequests]);

  const uniqueFromCities = [
    ...new Set(requests.map((request) => request.fromCity)),
  ];
  const uniqueToCities = [
    ...new Set(requests.map((request) => request.toCity)),
  ];

  const filteredRequests = requests.filter(
    (request) =>
      (fromCityFilter.length === 0 ||
        fromCityFilter.includes(request.fromCity)) &&
      (toCityFilter.length === 0 || toCityFilter.includes(request.toCity))
  );

  const sortedAndFilteredRequests = [...filteredRequests].sort((a, b) => {
    if (sortOption === "createdAt") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOption === "dispatchDate") {
      return (
        new Date(a.dispatchDate).getTime() - new Date(b.dispatchDate).getTime()
      );
    }
    return 0;
  });

  const handleCityFilterChange = (city: string, isFromCity: boolean) => {
    if (isFromCity) {
      setFromCityFilter((prev) =>
        prev.includes(city)
          ? prev.filter((c) => c !== city)
          : [...new Set([...prev, city])]
      );
    } else {
      setToCityFilter((prev) =>
        prev.includes(city)
          ? prev.filter((c) => c !== city)
          : [...new Set([...prev, city])]
      );
    }
  };

  const handleDeleteRequest = () => {
    if (currentOrder) {
      const updatedRequests = requests.filter(
        (request) => request.idOrder !== currentOrder
      );
      setRequests(updatedRequests);
      localStorage.setItem("orderRequests", JSON.stringify(updatedRequests));
      setOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    setIsEditable(id);
  };
  const handleSave = (id: string) => {
    const updatedRequests = requests.map((request) =>
      request.idOrder === id ? { ...request } : request
    );
    setRequests(updatedRequests);
    localStorage.setItem("orderRequests", JSON.stringify(updatedRequests));
    setIsEditable(null);
  };

  const handleChange = (id: string, field: keyof Request, value: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.idOrder === id ? { ...request, [field]: value } : request
      )
    );
  };

  const handleDateChange = (id: string, newDate: Dayjs | null) => {
    handleChange(id, "dispatchDate", newDate ? newDate.toISOString() : "");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6">All Requests</Typography>
      <Box sx={{ width: "30%" }}>
        <Filter
          title="From City"
          cities={uniqueFromCities}
          selectedCities={fromCityFilter}
          onCityChange={(city) => handleCityFilterChange(city, true)}
        />
      </Box>
      <Box sx={{ width: "30%", mt: 2 }}>
        <Filter
          title="To City"
          cities={uniqueToCities}
          selectedCities={toCityFilter}
          onCityChange={(city) => handleCityFilterChange(city, false)}
        />
      </Box>
      <Box sx={{ width: "30%", mt: 2 }}>
        <Sorting sortOption={sortOption} onSortChange={setSortOption} />
      </Box>
      <List>
        {sortedAndFilteredRequests.map((request) => (
          <ListItem
            key={request.idOrder}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Box sx={{ width: "60%" }}>
              {isEditable === request.idOrder ? (
                <>
                  <TextField
                    label="From City"
                    value={request.fromCity}
                    onChange={(e) =>
                      handleChange(request.idOrder, "fromCity", e.target.value)
                    }
                    fullWidth
                    size="small"
                    margin="normal"
                  />
                  <TextField
                    label="To City"
                    value={request.toCity}
                    onChange={(e) =>
                      handleChange(request.idOrder, "toCity", e.target.value)
                    }
                    fullWidth
                    size="small"
                    margin="normal"
                  />
                  {!request.isDeliverRequest && (
                    <FormControl fullWidth margin="normal" size="small">
                      <InputLabel id="parcel-type-label">
                        Parcel Type
                      </InputLabel>
                      <Select
                        labelId="parcel-type-label"
                        defaultValue={request.parcelType}
                        value={request.parcelType}
                        onChange={(e) =>
                          handleChange(
                            request.idOrder,
                            "parcelType",
                            e.target.value
                          )
                        }
                        label="Parcel Type"
                      >
                        <MenuItem value="gadgets">Gadgets</MenuItem>
                        <MenuItem value="drinks">Drinks</MenuItem>
                        <MenuItem value="clothes">Clothes</MenuItem>
                        <MenuItem value="medicines">Medicines</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                  <FormControl fullWidth margin="normal" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Dispatch Date"
                        value={dayjs(request.dispatchDate)}
                        onChange={(newDate) =>
                          handleDateChange(request.idOrder, newDate)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  {!request.isDeliverRequest && (
                    <TextField
                      label="Description"
                      value={request.description}
                      onChange={(e) =>
                        handleChange(
                          request.idOrder,
                          "description",
                          e.target.value
                        )
                      }
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h6">From: {request.fromCity}</Typography>
                  <Typography variant="h6">To: {request.toCity}</Typography>
                  {!request.isDeliverRequest && (
                    <Typography variant="subtitle1">
                      Parcel: {request.parcelType}
                    </Typography>
                  )}

                  <Typography variant="subtitle2">
                    Dispatch Date:
                    {dayjs(request.dispatchDate).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography variant="subtitle2">
                    Created At: {dayjs(request.createdAt).format("DD/MM/YYYY")}
                  </Typography>

                  {!showAllRequests && matchingRequests.length > 0 && (
                    <>
                      {matchingRequests.filter(
                        (match) =>
                          match.fromCity === request.fromCity &&
                          match.toCity === request.toCity
                      ).length > 0 && (
                        <>
                          <Typography variant="subtitle2" mt={2}>
                            Matching Requests:
                          </Typography>
                          <List>
                            {matchingRequests
                              .filter(
                                (match) =>
                                  match.fromCity === request.fromCity &&
                                  match.toCity === request.toCity
                              )
                              .map((match) => (
                                <ListItem key={match.idOrder}>
                                  <Typography variant="body2">
                                    From: {match.fromCity}, To: {match.toCity},
                                    Dispatch Date:{" "}
                                    {dayjs(match.dispatchDate).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </Typography>
                                </ListItem>
                              ))}
                          </List>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
            {loggedInUser === request.idUser && (
              <Box>
                {isEditable === request.idOrder ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleSave(request.idOrder)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleEdit(request.idOrder)}
                  >
                    Edit
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOpen(request.idOrder)}
                >
                  Delete
                </Button>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
      <ConfirmModal
        open={open}
        handleDelete={handleDeleteRequest}
        handleClose={() => setOpen(false)}
      />
    </Box>
  );
};

export default RequestList;
