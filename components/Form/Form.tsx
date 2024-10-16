"use client";
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { IData, IForm } from "../../utils/types";


const Form = ({ isDeliverRequest = false }: IForm) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fromCity: "",
            toCity: "",
            parcelType: "",
            dispatchDate: "",
            description: "",
        },
    });
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id;
    const router = useRouter();

    const saveDeliverRequest = (data: IData) => {
        const idOrder = uuidv4();
        const newRequest = {
            idOrder,
            idUser: userId,
            ...data,
            isDeliverRequest: true,
            createdAt: new Date().toISOString(),
        };

        const existingDeliverRequests = JSON.parse(
            localStorage.getItem("deliverRequests") || "[]"
        );
        const updatedRequests = [...existingDeliverRequests, newRequest];

        localStorage.setItem("deliverRequests", JSON.stringify(updatedRequests));
        router.push("/requests");
    };

    const saveOrderRequest = (data: IData) => {
        const idOrder = uuidv4();
        const newRequest = {
            idOrder,
            idUser: userId,
            ...data,
            isDeliverRequest: false,
            createdAt: new Date().toISOString(),
        };

        const existingOrderRequests = JSON.parse(
            localStorage.getItem("orderRequests") || "[]"
        );
        const updatedRequests = [...existingOrderRequests, newRequest];

        localStorage.setItem("orderRequests", JSON.stringify(updatedRequests));
        router.push("/requests");
    };
    const onSubmit = (data: {
        fromCity: string;
        toCity: string;
        parcelType?: string;
        dispatchDate: string;
        description?: string;
    }) => {
        if (isDeliverRequest) {
            saveDeliverRequest(data);
        } else {
            saveOrderRequest(data);
        }
    };

    const handleDateChange = (newDate: Dayjs | null) => {
        setValue("dispatchDate", newDate ? newDate.toISOString() : "", {
            shouldValidate: true,
        });
    };
    return (
        <Box sx={{ justifyContent: "center", aligbItems: "center" }}>
            <Container maxWidth="xs">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 4,
                        border: "1px solid rgba(25, 118, 210, 0.5)",
                        borderRadius: "8px",
                        p: 4,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
                        {isDeliverRequest ? "Create Deliver" : "Create Order"}
                    </Typography>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ width: "100%", maxWidth: "500px" }}
                    >
                        <TextField
                            label="From City"
                            fullWidth
                            margin="normal"
                            {...register("fromCity", { required: "This field is required" })}
                            error={!!errors.fromCity}
                            helperText={errors.fromCity?.message}
                            size="small"
                        />
                        <TextField
                            label="To City"
                            fullWidth
                            margin="normal"
                            {...register("toCity", { required: "This field is required" })}
                            error={!!errors.toCity}
                            helperText={errors.toCity?.message}
                            size="small"
                        />
                        {!isDeliverRequest && (
                            <FormControl
                                fullWidth
                                margin="normal"
                                size="small"
                                error={!!errors.parcelType}
                            >
                                <InputLabel id="parcel-type-label">Parcel Type</InputLabel>
                                <Select
                                    labelId="parcel-type-label"
                                    label="Parcel Type"
                                    {...register("parcelType")}
                                    defaultValue=""
                                >
                                    <MenuItem value="gadgets">Gadgets</MenuItem>
                                    <MenuItem value="drinks">Drinks</MenuItem>
                                    <MenuItem value="clothes">Clothes</MenuItem>
                                    <MenuItem value="medicines">Medicines</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                <Typography color="error" variant="caption">
                                    {errors.parcelType?.message}
                                </Typography>
                            </FormControl>
                        )}

                        <FormControl
                            fullWidth
                            margin="normal"
                            size="small"
                            error={!!errors.dispatchDate}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Dispatch Date"
                                    onChange={handleDateChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small",
                                            error: !!errors.dispatchDate,
                                            helperText: errors.dispatchDate?.message,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        {!isDeliverRequest && (
                            <TextField
                                label="Description"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                {...register("description")}
                                size="small"
                            />
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                        >
                            Submit
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default Form;
