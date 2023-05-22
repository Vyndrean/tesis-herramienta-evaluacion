import React from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, Heading, Text } from '@chakra-ui/react'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {}
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

const questions = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Heading textAlign="center">Preguntas</Heading>
      </Container>
    </>
  )
}

export default questions