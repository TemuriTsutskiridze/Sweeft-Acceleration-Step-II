import { useEffect, useState } from "react";
import styled from "styled-components";
import GlobalStyle from "./Globals";

type Coordinates = {
  latitude: number;
  longitude: number;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [userCountry, setUserCountry] = useState<string>("");
  const [countryData, setCountryData] = useState<any>({});

  async function getCountryData(country: string) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${country.toLowerCase()}`
      );

      console.log(
        `https://restcountries.com/v3.1/name/${country.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      console.log(jsonData);
      setCountryData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userCountry !== "") {
      getCountryData(userCountry);
    }
  }, [userCountry]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        setCountries(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    const fetchCountryByLocation = async (
      latitude: number,
      longitude: number
    ) => {
      try {
        // put api key later
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC4F7oJm1Lq2c6H6yHksYMf0VBHEriIZp8`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();

        setUserCountry(jsonData.results.at(-1).formatted_address);

        // const country = extractCountryFromGeocoding(jsonData);

        // if (country) {
        //   setSelectedCountry(country);
        // }
      } catch (error) {
        console.error("Error fetching country by location:", error);
      }
    };

    const fetchUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position.coords);
            fetchCountryByLocation(
              position.coords.latitude,
              position.coords.longitude
            );
            fetchData();
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported in this browser.");
      }
    };

    fetchUserLocation();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <CountriesWrapper>
          <Countries>
            {countries.map((country: any, index) => {
              return (
                <Option
                  key={index}
                  value={country.name.common}
                  // onClick={() => fetchCountry(country.name.common)}
                >
                  {country.name.common}
                </Option>
              );
            })}
          </Countries>
          {loading ? (
            <p>Loading</p>
          ) : (
            <svg
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-testid="ExpandMoreOutlinedIcon"
            >
              <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"></path>
            </svg>
          )}
        </CountriesWrapper>

        {/* <div>
          <div>
            {userCountry} <img src={countryData[0].flags.svg} alt={`coun`} />
          </div>
        </div> */}
      </Container>
    </>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  max-width: 120rem;
  border: 1px solid rgb(204, 204, 204);
  padding: 2.4rem;
  margin: 0 auto;
`;

const CountriesWrapper = styled.div`
  position: relative;

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 3.2rem;
    cursor: pointer;
  }

  & p {
    font-size: 1.6rem;
    font-weight: 400;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 3.2rem;
  }
`;

const Countries = styled.select`
  width: 100%;
  padding: 1.6rem 3.2rem 1.6rem 1.4rem;
  min-height: 1.4rem;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 4px;
  border: 1px solid rgb(204, 204, 204);
  outline: none;
  cursor: pointer;
  appearance: none;
  font-size: 1.6rem;
  font-weight: 400;
`;

const Option = styled.option`
  font-size: 1.6rem;
  font-weight: 400;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CountryName = styled.h4`
  font-weight: 400;
  font-size: 2.125rem;
  line-height: 1.235;
  letter-spacing: 0.00735em;
`;
