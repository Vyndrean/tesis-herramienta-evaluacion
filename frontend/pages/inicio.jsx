import React from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, Heading, List, ListItem, OrderedList, Stack, Text } from '@chakra-ui/react'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {
          data: check.data
        }
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
}

const inicio = ({data}) => {
  console.log(data)
  return (
    <>
      <Navbar />
      <Container maxW="container.lg">
        <Heading textAlign="center" size="lg" mt="5" mb="10">Bienvenido/a </Heading>

        <Stack>
          <Text mb="5">
            Nos complace darle la bienvenida a esta plataforma diseñada para apoyar y mejorar el proceso de evaluación de la experiencia de usuario (UX). aquí encontrara una amplia gama de características y herramientas que te permiten llevar a cabo evaluaciones efectivas y obtener información valiosa sobre la experiencia de tus usuarios.
            <br />
            La herramienta se ha desarrollado teniendo en cuenta un diseño para facilitar tu trabajo. Con una interfaz amigable, podrás navegar fácilmente por las diferentes secciones y aprovechar al máximo todas las funcionalidades que ofrecemos.
          </Text>
          <Text>
            Algunas de las características de la herramienta son:
          </Text>
          <OrderedList pl="10">
            <ListItem>
              Recopilación de datos: Podrás recopilar datos relevantes sobre la experiencia de usuario utilizando diferentes métodos, como encuestas, cuestionarios y pruebas de usabilidad. Estos datos te brindan información detallada y cuantitativa sobre como los usuarios interactúan con tu producto o servicio.
            </ListItem>
            <ListItem>
              Visualizacion de resultados: Presentamos los resultados de manera clara y visualmente atractiva. Permitiendo comprender rápidamente los puntos fuertes y débiles de tu producto o servicio en terminos de UX.
            </ListItem>
            <ListItem>
              Personalización: Adaptamos la herramienta a tus necesidades. Podrás personalizar los criterios de evaluación, crear tus propias plantillas de evaluación y ajustar los parámetros según los requisitos expedición de tu proyecto.
            </ListItem>
          </OrderedList>
        </Stack>
      </Container>
    </>
  )
}

export default inicio