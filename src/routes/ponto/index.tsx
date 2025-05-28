import { Button, CircularProgress, Flex } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
import { registrarPonto } from "../../stores/ponto/service";

// Coordenadas alvo
const TARGET_LAT = -25.426536;
const TARGET_LNG = -49.2832883;

// Função para calcular distância em metros usando Haversine
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000; // Raio da Terra em metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Ponto = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState(new Date());
  const [geoAllowed, setGeoAllowed] = useState<boolean>(false);
  const [inRange, setInRange] = useState<boolean>(false);

  const toast = useToast();

  // Solicita geolocalização ao montar o componente
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoAllowed(true);
        const { latitude, longitude } = position.coords;
        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          TARGET_LAT,
          TARGET_LNG
        );
        setInRange(distance <= 100);
      },
      () => {
        setGeoAllowed(false);
        setInRange(false);
      }
    );
  }, []);

  const handleRegistrarPonto = async () => {
    setLoading(true);
    try {
      await registrarPonto();
      toast({
        title: "Ponto registrado com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      window.location.href = "/detalhes-ponto";
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao registrar ponto",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <Sidebar>
      <Flex
        height="100vh"
        width="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={5}
      >
        <Flex fontSize="32px" fontWeight="bold">
          {time.toLocaleTimeString()}
        </Flex>
        <Button
          size="lg"
          isLoading={loading}
          onClick={handleRegistrarPonto}
          isDisabled={!geoAllowed || !inRange}
        >
          Registrar Ponto
          {loading ? (
            <CircularProgress
              ml={"10px"}
              isIndeterminate
              color="gray.500"
              size={5}
            />
          ) : (
            <TimeIcon ml="10px" />
          )}
        </Button>
        {!geoAllowed && (
          <Flex color="red.500" mt={2} fontSize="sm">
            Permita o acesso à localização para registrar o ponto.
          </Flex>
        )}
        {geoAllowed && !inRange && (
          <Flex color="red.500" mt={2} fontSize="sm">
            Você está fora da área permitida para registrar o ponto.
          </Flex>
        )}
      </Flex>
    </Sidebar>
  );
};

export default Ponto;
