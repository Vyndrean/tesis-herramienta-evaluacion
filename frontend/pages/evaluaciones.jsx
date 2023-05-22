import Navbar from '@/components/Navbar'
import React from 'react'
import { checkToken } from '@/data/login'

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

const evaluaciones = () => {
  return (
    <>
    <Navbar/>

    </>
  )
}

export default evaluaciones