import React from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container } from '@chakra-ui/react'

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

const inicio = () => {
  return (
    <>
      <Navbar />
      <Container>
        Pagina de Inicio
      </Container>
    </>
  )
}

export default inicio