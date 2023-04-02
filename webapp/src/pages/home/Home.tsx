import Map from "../../components/map/Map";
import "../../components/map/stylesheets/home.css";
import "./home.css"
function Home(): JSX.Element {
  return (
    <div className="homeContainer"  >
      <h1>Home</h1>
      <Map />
    </div>
  );
}
export default Home;