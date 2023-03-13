import { useState, useEffect } from "react";
import { LoginButton, CombinedDataProvider, useSession } from "@inrupt/solid-ui-react";
import { Button, TextField, FormGroup, Container } from "@mui/material";
import { makeRequest } from "../../axios";

import "./login.css"

const Login = () => {
    const [idp, setIdp] = useState("https://inrupt.net");
    const [currentUrl, setCurrentUrl] = useState("http://localhost:3000");
    const { session } = useSession();
    const { webId } = session.info;
    
    useEffect(() => {
      if (!(window.location.href === "http://localhost:3000/login")){
        setCurrentUrl(window.location.href);
      }
    }, [setCurrentUrl]);

    return (
      <Container>
        <h1 className="loginHeader"> Login </h1>
        <p className="loginText"> Welcome to LoMap!</p>
        <p className="loginText"> This application runs using the solid principles, this means, you need an account on a pod provider to use it. </p>
        <p className="loginText"> If you already have one, please log in.</p>
        <p className="loginText"> If not, please create an account in a pod provider as inrupt.net</p>
        <FormGroup>
          <TextField
            label="Identity Provider"
            placeholder="Identity Provider"
            type="url"
            value={idp}
            onChange={(e) => setIdp(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button onClick={(e) => {
                  //makeRequest.get("/login")
                  global.location.href = "http://localhost:8800/login";
                }} variant="contained">
                    Login
                </Button>
              ),
            }}
          />
        </FormGroup>
      </Container>
    );
  }

export default Login;