import Map from "../../components/map/Map";
import "./home.css"
import { Button } from "@mui/material";
import { useSession } from '@inrupt/solid-ui-react';
import { login } from "@inrupt/solid-client-authn-browser";

function Home(): JSX.Element {

  const session = useSession();

  const handleClick = async (e : any) => {
    e.preventDefault();
    login({
      redirectUrl: "http://localhost:3000/",
      oidcIssuer: "https://inrupt.net",
      clientName: "LoMap"
    });
  };

  return (
    <div className="homeContainer">
      <h1>Home</h1>
      <Map />
      <Button onClick={handleClick} variant="contained">
          Login
      </Button>
    </div>
  );
}
export default Home;