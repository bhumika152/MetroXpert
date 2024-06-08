import { useEffect, useState } from "react";
import Map from "../components/Map";
import StationNames from "../data/names.json";
import Links from "../data/links.json";
import MapMaker from "../data/index";
import Carrd from "../components/Carrd";
import * as Papa from "papaparse";
const Home = () => {
  let data = StationNames["StationNames"];
  const [stations, setStations] = useState({ source: "", destination: "" });
  let map_maker = new MapMaker();
  let results = map_maker.getResult();
  const [Cards, setCards] = useState([]);
  const [mapstate, setMapstate] = useState(undefined);
  const [curr, setcurr] = useState(undefined);
  const [nodes, setnodes] = useState([])
  const onChange = (e) => {
    setStations({ ...stations, [e.target.name]: e.target.value });
  };
  const onChange1  = (e)=>{
    let l = [...nodes]
    l[e.target.name] = e.target.value
    setnodes(l)
  }
  const onSearch = async () => {
    let inp = {...stations}
    if(nodes.length!==0){
      inp["nodes"] = nodes
    }
    const res = await fetch("http://localhost:5000/getPath", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inp),
    });
    const json = await res.json();
    makeCards(json["path"]);
    setMapstate(json["path"]);
  };
  async function getL(path) {
    let res = [];
      for(let i=0;i<path.length-1;i++){
        console.log(path[i])
        let arr = await Links.filter((item)=>((item.Start==path[i]) && (item.End==path[i+1])))
        res.push(arr[0])
      }
      if(await res.includes(undefined)){
      res = []
      for(let i=0;i<path.length-1;i++){
        console.log(path[i])
        let arr = await Links.filter((item)=>((item.End==path[i]) && (item.Start==path[i+1])))
        let dn= arr[0]
        let temp = dn.Start
        dn.Start = dn.End
        dn.End = temp
        res.push(dn)
      }
    }
    return res;
  }
  const makeCards = async (path) => {
    let cr = await getL(path);
    console.log(cr)
    setCards(cr)
  };

  return (
    <div className="pt-20 px-10">
      <div className="flex w-full gap-[8rem]">
        <div>
          <Map mapstate={mapstate} />
        </div>
        <div className="">
          <div className="max-w-sm mx-auto">
            <label
              htmlFor="countries"
              className="block mb-2 text-lg font-medium text-gray-900 "
            >
              Select a Starting Station
            </label>
            <div className="flex gap-5">
            <select
              name="source"
              onChange={onChange}
              className="bg-gray-50 text-lg border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected="">Choose a Station</option>
              {data.map((i) => (
                <option value={i}>{i}</option>
              ))}
            </select>
            </div>
            <div className="flex justify-center pt-3">
            <button
              type="button"
              onClick={()=>{setnodes(nodes=>[...nodes,1])}}
              className="focus:outline-none  text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              Add Station
            </button>
            </div>
          </div>
          {nodes.map((item,index)=>
          <div className="max-w-sm mx-auto mt-5">
            <label
              htmlFor="countries"
              className="block mb-2 text-lg font-medium text-gray-900"
            >
              Select a Station
            </label>
            <div className="flex">
            <select
              name={index}
              onChange={onChange1}
              className="bg-gray-50 text-lg border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected="">Choose a Station</option>
              {data.map((i) => (
                <option value={i}>{i}</option>
              ))}
            </select>
            <div className="ml-5 my-auto" onClick={()=>{  setnodes([...nodes.slice(0, index),...nodes.slice(index + 1)])}}>
            <svg fill="#000000"  height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 490 490">
            <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 
              489.292,457.678 277.331,245.004 489.292,32.337 "/>
            </svg>
            </div>
            </div>
          </div>)
          }
          <div className="max-w-sm mx-auto mt-5">
            <label
              htmlFor="countries"
              className="block mb-2 text-lg font-medium text-gray-900 "
            >
              Select a Destination Station
            </label>
            <select
              name="destination"
              onChange={onChange}
              id="countries"
              className="bg-gray-50 text-lg border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected="">Choose a Station</option>
              {data.map((i) => (
                <option value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center mt-5 ">
            <button
              type="button"
              onClick={onSearch}
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 "
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-5 flex-wrap">
        { Cards.map((item)=>{
          return(
          <Carrd card = {item} currL={curr} setcurrL={setcurr} />
        )
        })
        }
      </div>
    </div>
  );
};

export default Home;
