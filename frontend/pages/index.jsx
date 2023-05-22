import React, { useState } from 'react'
import { Box, Container, Flex, Heading, Stack } from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { login, checkToken } from "../data/login"
import Cookie from "js-cookie"
import router from 'next/router'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        redirect: {
          destination: "/inicio",
          permanent: false
        }
      }
    }
  } catch (error) {
    return {
      props: {}
    }
  }
}

const index = () => {
  const [sesion, setSesion] = useState({
    username: "",
    password: ""
  })

  const handleChange = (event) => {
    setSesion({
      ...sesion,
      [event.target.name]: event.target.value
    })
  }

  const submitSesion = async (e) => {
    e.preventDefault();
    try {
      const res = await login(sesion)
      if (res.status == 200) {
        Cookie.set("token", res.data.token, { expires: 1 })
        console.log("Se inicio sesion")
        router.push('/inicio')
      }
    } catch (error) {
      return (
        console.log("No se inicio sesion")
      )
    }
  }

  return (
    <Container maxW={"container.md"} mt="6%" bgColor="#" borderRadius="20">
      <Stack>
        <Flex
          flexDirection="column"
          width="100%"
          height="500%"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar bg="blackAlpha.700" />
            <Heading color="teal.400">Inicio de Sesion</Heading>
            <Box min={{ base: "90%", md: '468px' }}>
              <form>
                <Stack
                  spacing="4"
                  p="1rem"
                  backgroundColor="whiteAlpha.900"
                  boxShadow="md"
                  borderRadius="20"
                >
                  <FormControl>
                    <FormLabel>Nombre de Usuario</FormLabel>
                    <Input type='text' name='username' id='username' onChange={handleChange} />
                    <FormLabel>Contraseña</FormLabel>
                    <Input type='password' name='password' id='password' onChange={handleChange} />
                  </FormControl>
                  <Button colorScheme='green' onClick={submitSesion}>Ingresar</Button>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  )
}

export default index