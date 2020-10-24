import React, { useState, useEffect } from "react";
import "./css/App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import image from "./images/Covid.png";
import "leaflet/dist/leaflet.css";
import { ThemeProvider, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .app {
    background-color: ${props => props.theme.mode === 'light' ? '#2B2D2F' : "#F5F6FA"}
  }
  body {
    background-color: ${props => props.theme.mode === 'light' ? '#2B2D2F' : "#F5F6FA"}
  }
`

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [theme, setTheme] = useState({mode: 'dark'});

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(5);
        } else {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(3);
        }
      });
  };

  const toggleDarkMode = () => {
    setTheme(theme.mode === 'light' ? { mode: 'dark' } : { mode: 'light' });
  };

  return (
    <ThemeProvider theme={theme}>
      <>
      <GlobalStyle />
        <div className="app">
          <div className="app__left">
            <div className="app__header">
              <img className="app__image" src={image} alt="COVID-19" />
              <label class="switch">
  <input type="checkbox" />
  <span class="slider round" onClick={toggleDarkMode}></span>
</label>
              <FormControl className="app__dropdown">
                <Select
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="app__stats">
              <InfoBox
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus Cases"
                isRed
                active={casesType === "cases"}
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                isGreen
                active={casesType === "recovered"}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                isBlack
                active={casesType === "deaths"}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
            </div>
            <Map
              countries={mapCountries}
              casesType={casesType}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
          <Card className="app__right">
            <CardContent>
              <div className="app__information">
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />
                <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
                <LineGraph className="app__graph" casesType={casesType} />
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    </ThemeProvider>
  );
};

export default App;
