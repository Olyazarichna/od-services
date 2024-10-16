"use client";
import { Box, Button, Container, Input, Link, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { emailPattern, passwordPattern } from "../../utils/pattern";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import css from "./SignupForm.module.css";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    const existingUsersRaw = localStorage.getItem("users");
    let existingUsers = [];

    if (existingUsersRaw) {
      try {
        existingUsers = JSON.parse(existingUsersRaw);
        if (!Array.isArray(existingUsers)) {
          existingUsers = [];
        }
      } catch (error) {
        console.error("Error parsing users from localStorage:", error);
        existingUsers = [];
      }
    }

    const existingUser = existingUsers.find(
      (user: { email: string }) => user.email === data.email
    );

    if (existingUser) {
      alert("User with this email already exists.");
      return;
    }
    const id = uuidv4();
    const newUser = {
      id,
      email: data.email,
      password: data.password,
    };

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    localStorage.setItem(
      "user",
      JSON.stringify({ id: newUser.id, email: newUser.email })
    );

    router.push("/requests");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={css.wrapper}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid rgba(25, 118, 210, 0.5)",
            borderRadius: "8px",
            minWidth: "280px",
          }}
          padding={4}
        >
          <Typography
            component="h2"
            color="primary"
            sx={{ fontWeight: "700", marginBottom: "20px", fontSize: "32px" }}
          >
            Sign up
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
            <Input
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: emailPattern,
                  message: "Invalid email address",
                },
              })}
              id="email"
              name="email"
              placeholder="Email"
              className={css.fullInput}
              autoComplete="email"
              autoFocus
            />

            <Typography color="error" variant="caption">
              {typeof errors.email?.message === "string"
                ? errors.email.message
                : ""}
            </Typography>

            <div className={css.passWrap}>
              <Input
                {...register("password", {
                  required: "This field is required",
                  pattern: {
                    value: passwordPattern,
                    message:
                      "Password must be at least 8 characters with one uppercase, one number, and one special character.",
                  },
                })}
                name="password"
                placeholder="Password"
                className={css.fullInput}
                type={(showPassword && "text") || "password"}
                id="password"
                autoComplete="password"
              />
              <Typography color="error" variant="caption">
                {typeof errors.password?.message === "string"
                  ? errors.password.message
                  : ""}
              </Typography>
              <button
                className={css.buttonPass}
                type="button"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <RemoveRedEyeIcon style={{ width: "24px", height: "24px" }} />
                ) : (
                  <VisibilityOffIcon
                    style={{ width: "24px", height: "24px" }}
                  />
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="outlined"
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              Sign up
            </Button>
          </form>
          <Box
            sx={{
              display: "flex",
              mt: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ mr: 1 }}>Already have an account?</Typography>
            <Link href="/login">Log in</Link>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default SignupForm;
