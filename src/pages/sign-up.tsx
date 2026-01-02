import { Box, Button, Card, Checkbox, FormControl, FormControlLabel, FormLabel, Link, TextField } from "@mui/material";
import { useState } from "react";
import { Typography } from "@/components/ui/text/Typography/Typography";

const SignUpPage = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      club: data.get("club"),
    });
  };
  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const confirmPassword = document.getElementById("confirmPassword") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (password.value !== confirmPassword.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
  }

    return isValid;
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card variant="outlined" className="shadow-avatar-menu w-full max-w-[450px] p-4">
        <Typography size="h4">Sign up</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel>First name</FormLabel>
            <TextField
            id="firstName"
            fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel>Last name</FormLabel>
            <TextField
              id="lastName"
              fullWidth
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <TextField
              id="email"
              type="email"
              error={emailError}
              helperText={emailErrorMessage}
              fullWidth
            />
          </FormControl>

          <FormControl>
            <FormLabel>Club name</FormLabel>
            <TextField
              id="club"
              fullWidth
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <TextField
              id="password"
              type="password"
              error={passwordError}
              helperText={passwordErrorMessage}
              fullWidth
            />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm password</FormLabel>
            <TextField
              id="confirmPassword"
              type="password"
              error={confirmPasswordError}
              helperText={confirmPasswordErrorMessage}
              fullWidth
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
            Create account
          </Button>

          <Link className="self-center" href="/sign-in">
            Already have an account? Sign in
          </Link>
        </Box>
      </Card>
    </div>
  );
};

export default SignUpPage;
