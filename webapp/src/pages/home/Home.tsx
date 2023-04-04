import { useEffect } from "react";
import Map from "../../components/map/Map";
import "./home.css"
import { useSession } from "@inrupt/solid-ui-react";
import { makeRequest } from "../../axios";
function Home(): JSX.Element {
  const {session} = useSession();
 
  useEffect(() => {
    if (session.info.webId !== undefined && session.info.webId !== "") {
      console.log(session.info.webId);
      makeRequest.post("/users/",{solidURL: session.info.webId});
    } 
  }, [session]);
  return (
    <div className="homeContainer">
      <h1>Home</h1>
      <Map />
    </div>
  );
}
export default Home;