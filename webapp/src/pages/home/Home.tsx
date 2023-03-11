import Map from "../../components/map/Map";
import "./home.css"
function Home(): JSX.Element {
  return (
    <div className="homeContainer"  style={{backgroundImage:'url(/brussels1.png)'}}>
      <h1>Home</h1>
      <Map />
    </div>
  );
}
export default Home;