import { useEffect, useState } from "react";
import styled from "styled-components";
import GlobalStyle from "./Globals";
import { Coordinates } from "navigator";

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null); // Store user's location

  console.log(countries[0]);

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

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position.coords);
            fetchCountryByLocation(
              position.coords.latitude,
              position.coords.longitude
            );
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
  });

  const fetchCountryByLocation = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();

      // const country = extractCountryFromGeocoding(jsonData);

      // if (country) {
      //   setSelectedCountry(country);
      // }
    } catch (error) {
      console.error("Error fetching country by location:", error);
    }
  };

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

        <TitleContainer>
          <CountryName>{country}</CountryName>
        </TitleContainer>
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
