"use client";
import { Box, Button, Container, Input, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { emailPattern, passwordPattern } from "../../utils/pattern";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import css from "./LoginForm.module.css";
import { useRouter } from "next/navigation";

const LoginForm = () => {
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

    if (!existingUser) {
      alert("User does not exist. Please check your email or sign up.");
      return;
    }

    if (existingUser.password !== data.password) {
      alert("Something went wrang. Please try again.");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ id: existingUser.id, email: existingUser.email })
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
            Log in
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
                {(showPassword && (
                  <RemoveRedEyeIcon style={{ width: "24px", height: "24px" }} />
                )) || (
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
              Log in
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
            <Typography sx={{ mr: 1 }}>Do not have an account?</Typography>
            <Link href="/signup">Sign up</Link>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginForm;
