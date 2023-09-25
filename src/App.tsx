import { useEffect, useState } from "react";
import styled from "styled-components";
import GlobalStyle from "./Globals";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");

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

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const geocodingResponse = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCzKhJdcPyon6UYWXXT9dSfiFqqo10KGVA`
              );

              if (!geocodingResponse.ok) {
                throw new Error("Geocoding response was not ok");
              }

              const geocodingData = await geocodingResponse.json();
              console.log(geocodingData);
              if (
                geocodingData.results &&
                geocodingData.results.length > 0 &&
                geocodingData.results[0].address_components
              ) {
                const country =
                  geocodingData.results[0].address_components.find(
                    (component: any) => component.types.includes("country")
                  );

                if (country) {
                  // Set the selected country based on the user's location
                  setSelectedCountry(country.long_name);
                }
              }
            } catch (error) {
              console.error("Error fetching country by location:", error);
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          }
        );
      } else {
        console.error("Geolocation is not available in this browser.");
      }
    }

    fetchData();
  }, []);

  async function fetchCountry(name: string) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${name}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      setCountry(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  console.log(country);

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
                  onClick={() => fetchCountry(country.name.common)}
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
        {/* <SelectedCountry>
          Selected Country: {selectedCountry || "Not available"}
        </SelectedCountry> */}

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

// const SelectedCountry = styled.div`
//   margin-top: 1rem;
//   font-size: 1.6rem;
//   font-weight: 400;
// `;

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
